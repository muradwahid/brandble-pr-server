import httpStatus from "http-status";
import Stripe from 'stripe';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { CustomRequest } from './stripe.interface';
const stripe = new Stripe(config.stripe.secretKey as string);

const paymentIntent = async (data: any) => {
    const { price } = data;
    const amount = Math.round(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
    })


    return paymentIntent.client_secret

}

const savePaymentInfo = async (data: any) => {

}


// const createSetupIntent = async () => {

//     let customerId = (await user())?.stripeCustomerId as any;


//     let tempUser = await prisma.user.findUnique({
//         where: {
//             id: (await user())?.id as string
//         }
//     })
//     if (!tempUser) {
//         tempUser = await prisma.user.create({
//             data: {
//                 id: (await user())?.id,
//                 userId: (await user())?.userId,
//                 name: (await user())?.name as string,
//                 email: (await user())?.email as string,
//                 password: (await user())?.password as string
//             }
//         })
//     }
//     //stripe customer create
//     if (!customerId) {
//         let customer = await stripe.customers.create({
//             email: (await user())?.email as string,
//             metadata: {
//                 userId: (await user())?.id as string
//             }
//         })

//         customerId = customer.id;

//         //update user
//         await prisma.user.update({
//             where: {
//                 id: (await user())?.id as string
//             },
//             data: {
//                 stripeCustomerId: customerId
//             }
//         })

//     }
//     //setup intent
//     const setupIntent = await stripe.setupIntents.create({
//         customer: customerId,
//         payment_method_types: ['card'],
//         usage:'on_session'
//     })

//     return setupIntent;

// }

// const savePaymentMethod = async (data: any)=>{
//     const { paymentMethodId } = data;
//     console.log("method id", paymentMethodId);
//     const userId = await prisma.user.findFirst({
//         where: {
//             id: (await user())?.id
//         }
//     })

//     if (!paymentMethodId) {
//         throw new ApiError(400, 'Payment method id is required');
//     }

//     if (!userId?.stripeCustomerId) {
//         throw new ApiError(400, 'Stripe customer not found');
//     }

//     // payment method attach to customer
//     await stripe.paymentMethods.attach(paymentMethodId, {
//         customer: userId.stripeCustomerId
//     })

//     // retrive existing payment methods
//     const existingPaymentMethods = await prisma.paymentMethod.findMany({
//         where: {
//             userId: (await user())?.id
//         }
//     })
//     const isFirstPayment = existingPaymentMethods.length === 0;
//     // is first payment method make the default
//     if (isFirstPayment) {
//         await stripe.customers.update(userId.stripeCustomerId, {
//             invoice_settings: {
//                 default_payment_method: paymentMethodId
//             }
//         })
//     }
//     // retrive details for payment method
//     const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

//     // save from database

//     const savedPayment = await prisma.paymentMethod.create({
//         data: {
//             userId: (await user())?.id as string,
//             stripePaymentMethodId: paymentMethodId,
//             brand: paymentMethod.card?.brand as any,
//             last4: paymentMethod.card?.last4 as any,
//             expMonth: paymentMethod.card?.exp_month as any,
//             expYear: paymentMethod.card?.exp_year as any,
//             email: paymentMethod.billing_details.email as string,
//             name: paymentMethod.billing_details.name as string,
//             phone: paymentMethod.billing_details.phone as string,
//             isDefault: isFirstPayment
//         }
//     })
//     return savedPayment;
// }

const createSetupIntent = async (req:CustomRequest) => {
    const user = req.user;
    console.log({user});
    console.log("create setup intent", user);
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })
    console.log({ currentUser });
    if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    let customerId = currentUser?.stripeCustomerId;

    //stripe customer create
    if (!currentUser.stripeCustomerId) {
        let customer = await stripe.customers.create({
            email: currentUser.email as string,
            metadata: {
                userId: currentUser.id as string
            }
        })

        customerId = customer.id;

        //update user 
        await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                stripeCustomerId: customerId
            }
        })

    }

    if(customerId) throw new ApiError(httpStatus.NOT_FOUND, 'Stripe customer not found')
    //setup intent
    const setupIntent = await stripe.setupIntents.create({
        customer: customerId ?? '',
        payment_method_types: [
            'card',
            // 'paypal',
            // 'link',
            // 'us_bank_account',
            // 'sepa_debit',
            // 'ideal',
            // 'bancontact',
            // 'sofort',
            // 'eps',
            // 'giropay',
            // 'p24'
        ],
        usage: 'on_session'
    })

    return setupIntent;

}

const savePaymentMethod = async (req:CustomRequest) => {
    const user = req.user;
    const data = req.body;
    const { paymentMethodId } = data;
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

    if (!currentUser) {
        throw new ApiError(401, 'User not authenticated');
    }

    const userId = await prisma.user.findFirst({
        where: {
            id: currentUser.id
        }
    });

    if (!paymentMethodId) {
        throw new ApiError(400, 'Payment method ID is required');
    }

    if (!userId?.stripeCustomerId) {
        throw new ApiError(400, 'Stripe customer not found');
    }

    try {
        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: userId.stripeCustomerId
        });

        // Retrieve payment method details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        // console.log("Full payment method details:", JSON.stringify(paymentMethod, null, 2));

        // Extract common details based on payment method type
        let brand = 'unknown';
        let last4 = '';
        let expMonth = null;
        let expYear = null;

        // Handle different payment method types
        switch (paymentMethod.type) {
            case 'card':
                brand = paymentMethod.card?.brand || 'card';
                last4 = paymentMethod.card?.last4 || '';
                expMonth = paymentMethod.card?.exp_month;
                expYear = paymentMethod.card?.exp_year;
                break;
            case 'paypal':
                brand = 'paypal';
                last4 = 'PayPal';
                break;
            case 'us_bank_account':
                brand = 'bank_account';
                last4 = paymentMethod.us_bank_account?.last4 || '';
                break;
            case 'sepa_debit':
                brand = 'sepa_debit';
                last4 = paymentMethod.sepa_debit?.last4 || '';
                break;
            case 'link':
                brand = 'link';
                last4 = 'Link';
                break;
            default:
                brand = paymentMethod.type;
                last4 = paymentMethod.type.toUpperCase();
        }

        // Retrieve existing payment methods
        const existingPaymentMethods = await prisma.paymentMethod.findMany({
            where: {
                userId: currentUser.id
            }
        });

        const isFirstPayment = existingPaymentMethods.length === 0;

        // If first payment method, make it the default
        if (isFirstPayment) {
            await stripe.customers.update(userId.stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });
        }

        // Save to database
        const savedPayment = await prisma.paymentMethod.create({
            data: {
                userId: currentUser.id,
                stripePaymentMethodId: paymentMethodId,
                type: paymentMethod.type as any, // Save payment method type
                brand: brand,
                last4: last4,
                expMonth: expMonth as any,
                expYear: expYear as any,
                // Billing details from Stripe
                email: paymentMethod.billing_details?.email || null,
                name: paymentMethod.billing_details?.name || null,
                phone: paymentMethod.billing_details?.phone || null,
                billingAddress: paymentMethod.billing_details?.address ?
                    JSON.stringify(paymentMethod.billing_details.address) : null,
                isDefault: isFirstPayment
            }
        });

        return {
            success: true,
            message: 'Payment method saved successfully',
            paymentMethod: savedPayment
        };

    } catch (error) {
        console.error('Error in savePaymentMethod:', error);

        if (error && typeof error === 'object' && 'type' in error && error.type === 'StripeInvalidRequestError') {
            throw new ApiError(400, `Stripe error: ${(error as any).message as string}`);
        }
        throw new ApiError(500, 'Failed to save payment method');
    }
};

const processPayment = async (req: CustomRequest) => {
    const user = req.user;
    const { paymentMethodId, amount, currency = 'usd' } = req.body as any;
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!currentUser) throw new ApiError(401, 'User not authenticated');

    const total = Math.round(amount * 100);

    if (!paymentMethodId || !amount) throw new ApiError(400, 'Payment method id and amount are required');
    if (!currentUser?.stripeCustomerId) throw new ApiError(400, 'Stripe customer not found');
    
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount:total,
        currency,
        customer: currentUser.stripeCustomerId,
        payment_method: paymentMethodId,
        off_session: true, // customer is not exist but payment process
        confirm: true
    })
    if (paymentIntent.status === 'succeeded') {
        const paymentMethod = await prisma.paymentMethod.findFirst({
            where: {
                stripePaymentMethodId: paymentMethodId
            }
        })

        return {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
            amount: amount,
            currency: currency,
            paymentMethod: paymentMethod

        }
    }else{
        throw new ApiError(400, 'Payment failed');
    }
}

const getPaymentMethods = async (req: CustomRequest) => { 
    const user = req.user;
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })
    if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    // const paymentMethods = await prisma.paymentMethod.findMany({
    //     where: {
    //         userId: currentUser?.id
    //     },
    //     orderBy: {
    //         isDefault: 'desc'
        
    //     }
    // })

    const paymentMethods = await prisma.$transaction(async (transactionClient) => {
        const methods = await transactionClient.paymentMethod.findMany({
            where: {
                userId: currentUser?.id
            },
            orderBy: {
                isDefault: 'desc'
            }
        })
        const newData = await Promise.all(methods.map(async (method) => {
            const stripeData = await stripe.paymentMethods.retrieve(method.stripePaymentMethodId as string);
            return { ...method, stripeData };
        }));
        return newData;
     });

    

    // const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethods[3]?.stripePaymentMethodId as string);
    
    return paymentMethods;
}

const setDefaultPaymentMethod = async (req:CustomRequest) => { 
    const user = req.user;
    const data = req.body;
    const { paymentMethodId } = data;
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })
    if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    if (!paymentMethodId) throw new ApiError(400, 'Payment method ID is required');


    const updatedPayment = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.paymentMethod.updateMany({
            where: {
                userId: currentUser?.id
            },
            data: {
                isDefault: false
            }
        })
        const setDefault = await transactionClient.paymentMethod.update({
            where: {
                id: paymentMethodId,
                userId: currentUser?.id
            },
            data: {
                isDefault: true
            }
        })
        return setDefault;
    })

    // update stripe customer default payment method
    if (currentUser?.stripeCustomerId) {
        await stripe.customers.update(currentUser.stripeCustomerId, {
            invoice_settings: {
                default_payment_method:updatedPayment.stripePaymentMethodId
            }
        })
        
    }

    return updatedPayment;
}

const deletePaymentMethod = async (req:CustomRequest) => {
    const id = req.params.id
    const user = req.user;
    const currentUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })
    if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
            id: id,
            userId: currentUser?.id
        
        }
    })
    try {
        await stripe.paymentMethods.detach(paymentMethod?.stripePaymentMethodId as string);
        
    } catch (error) {
        throw new ApiError(400, 'Payment method not found');
    }
    const result = await prisma.paymentMethod.delete({
        where: {
            id: id
        }
    })

    // if deleted payment method is default, set new method default
    if (paymentMethod?.isDefault) {
        const remainingMethods = await prisma.paymentMethod.findMany({
            where: {
                userId: currentUser?.id
            },
            take:1
        })
        if (remainingMethods.length > 0) {
            await prisma.paymentMethod.update({
                where: {
                    id:remainingMethods[0].id
                },
                data: {
                    isDefault: true
                }
            })
        }
        // update stripe customer default
        if ((user as any).stripeCustomerId) {
            await stripe.customers.update((user as any).stripeCustomerId, {
                invoice_settings: {
                    default_payment_method:remainingMethods[0].stripePaymentMethodId
                }
            })
        }
    }
  return result;
}

export const StripeService = {
    paymentIntent,
    savePaymentInfo,
    createSetupIntent,
    savePaymentMethod,
    getPaymentMethods,
    processPayment,
    setDefaultPaymentMethod,
    deletePaymentMethod

}