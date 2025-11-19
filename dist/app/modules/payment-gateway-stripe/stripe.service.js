"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe = new stripe_1.default(config_1.default.stripe.secretKey);
const paymentIntent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { price } = data;
    const amount = Math.round(price * 100);
    const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent.client_secret;
});
const savePaymentInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
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
const createSetupIntent = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    let customerId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.stripeCustomerId;
    //stripe customer create
    if (!currentUser.stripeCustomerId) {
        let customer = yield stripe.customers.create({
            email: currentUser.email,
            metadata: {
                userId: currentUser.id
            }
        });
        customerId = customer.id;
        //update user 
        yield prisma_1.default.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                stripeCustomerId: customerId
            }
        });
    }
    if (!customerId)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Stripe customer not found');
    //setup intent
    const setupIntent = yield stripe.setupIntents.create({
        customer: customerId !== null && customerId !== void 0 ? customerId : '',
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
    });
    return setupIntent;
});
const savePaymentMethod = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const user = req.user;
    const data = req.body;
    const { paymentMethodId } = data;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    if (!currentUser) {
        throw new ApiError_1.default(401, 'User not authenticated');
    }
    const userId = yield prisma_1.default.user.findFirst({
        where: {
            id: currentUser.id
        }
    });
    if (!paymentMethodId) {
        throw new ApiError_1.default(400, 'Payment method ID is required');
    }
    if (!(userId === null || userId === void 0 ? void 0 : userId.stripeCustomerId)) {
        throw new ApiError_1.default(400, 'Stripe customer not found');
    }
    try {
        // Attach payment method to customer
        yield stripe.paymentMethods.attach(paymentMethodId, {
            customer: userId.stripeCustomerId
        });
        const paymentMethod = yield stripe.paymentMethods.retrieve(paymentMethodId);
        let brand = 'unknown';
        let last4 = '';
        let expMonth = null;
        let expYear = null;
        // Handle different payment method types
        switch (paymentMethod.type) {
            case 'card':
                brand = ((_a = paymentMethod.card) === null || _a === void 0 ? void 0 : _a.brand) || 'card';
                last4 = ((_b = paymentMethod.card) === null || _b === void 0 ? void 0 : _b.last4) || '';
                expMonth = (_c = paymentMethod.card) === null || _c === void 0 ? void 0 : _c.exp_month;
                expYear = (_d = paymentMethod.card) === null || _d === void 0 ? void 0 : _d.exp_year;
                break;
            case 'paypal':
                brand = 'paypal';
                last4 = 'PayPal';
                break;
            case 'us_bank_account':
                brand = 'bank_account';
                last4 = ((_e = paymentMethod.us_bank_account) === null || _e === void 0 ? void 0 : _e.last4) || '';
                break;
            case 'sepa_debit':
                brand = 'sepa_debit';
                last4 = ((_f = paymentMethod.sepa_debit) === null || _f === void 0 ? void 0 : _f.last4) || '';
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
        const existingPaymentMethods = yield prisma_1.default.paymentMethod.findMany({
            where: {
                userId: currentUser.id
            }
        });
        const isFirstPayment = existingPaymentMethods.length === 0;
        // If first payment method, make it the default
        if (isFirstPayment) {
            yield stripe.customers.update(userId.stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });
        }
        // Save to database
        const savedPayment = yield prisma_1.default.paymentMethod.create({
            data: {
                userId: currentUser.id,
                stripePaymentMethodId: paymentMethodId,
                type: paymentMethod.type, // Save payment method type
                brand: brand,
                last4: last4,
                expMonth: expMonth,
                expYear: expYear,
                // Billing details from Stripe
                email: ((_g = paymentMethod.billing_details) === null || _g === void 0 ? void 0 : _g.email) || null,
                name: ((_h = paymentMethod.billing_details) === null || _h === void 0 ? void 0 : _h.name) || null,
                phone: ((_j = paymentMethod.billing_details) === null || _j === void 0 ? void 0 : _j.phone) || null,
                billingAddress: ((_k = paymentMethod.billing_details) === null || _k === void 0 ? void 0 : _k.address) ?
                    JSON.stringify(paymentMethod.billing_details.address) : null,
                isDefault: isFirstPayment
            }
        });
        return {
            success: true,
            message: 'Payment method saved successfully',
            paymentMethod: savedPayment
        };
    }
    catch (error) {
        console.error('Error in savePaymentMethod:', error);
        if (error && typeof error === 'object' && 'type' in error && error.type === 'StripeInvalidRequestError') {
            throw new ApiError_1.default(400, `Stripe error: ${error.message}`);
        }
        throw new ApiError_1.default(500, 'Failed to save payment method');
    }
});
const processPayment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { paymentMethodId, amount, currency = 'usd' } = req.body;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(401, 'User not authenticated');
    const total = Math.round(amount * 100);
    if (!paymentMethodId || !amount)
        throw new ApiError_1.default(400, 'Payment method id and amount are required');
    if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.stripeCustomerId))
        throw new ApiError_1.default(400, 'Stripe customer not found');
    //create payment intent
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: total,
        currency,
        customer: currentUser.stripeCustomerId,
        payment_method: paymentMethodId,
        off_session: true, // customer is not exist but payment process
        confirm: true
    });
    if (paymentIntent.status === 'succeeded') {
        const paymentMethod = yield prisma_1.default.paymentMethod.findFirst({
            where: {
                stripePaymentMethodId: paymentMethodId
            }
        });
        return {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
            amount: amount,
            currency: currency,
            paymentMethod: paymentMethod
        };
    }
    else {
        throw new ApiError_1.default(400, 'Payment failed');
    }
});
const getPaymentMethods = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    // const paymentMethods = await prisma.paymentMethod.findMany({
    //     where: {
    //         userId: currentUser?.id
    //     },
    //     orderBy: {
    //         isDefault: 'desc'
    //     }
    // })
    const paymentMethods = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const methods = yield transactionClient.paymentMethod.findMany({
            where: {
                userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
            },
            orderBy: {
                isDefault: 'desc'
            }
        });
        const newData = yield Promise.all(methods.map((method) => __awaiter(void 0, void 0, void 0, function* () {
            const stripeData = yield stripe.paymentMethods.retrieve(method.stripePaymentMethodId);
            return Object.assign(Object.assign({}, method), { stripeData });
        })));
        return newData;
    }));
    // const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethods[3]?.stripePaymentMethodId as string);
    return paymentMethods;
});
const setDefaultPaymentMethod = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const data = req.body;
    const { paymentMethodId } = data;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    if (!paymentMethodId)
        throw new ApiError_1.default(400, 'Payment method ID is required');
    const updatedPayment = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.paymentMethod.updateMany({
            where: {
                userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
            },
            data: {
                isDefault: false
            }
        });
        const setDefault = yield transactionClient.paymentMethod.update({
            where: {
                id: paymentMethodId,
                userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
            },
            data: {
                isDefault: true
            }
        });
        return setDefault;
    }));
    // update stripe customer default payment method
    if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.stripeCustomerId) {
        yield stripe.customers.update(currentUser.stripeCustomerId, {
            invoice_settings: {
                default_payment_method: updatedPayment.stripePaymentMethodId
            }
        });
    }
    return updatedPayment;
});
const deletePaymentMethod = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    const currentUser = yield prisma_1.default.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!currentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    const paymentMethod = yield prisma_1.default.paymentMethod.findFirst({
        where: {
            id: id,
            userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
        }
    });
    try {
        yield stripe.paymentMethods.detach(paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.stripePaymentMethodId);
    }
    catch (error) {
        throw new ApiError_1.default(400, 'Payment method not found');
    }
    const result = yield prisma_1.default.paymentMethod.delete({
        where: {
            id: id
        }
    });
    // if deleted payment method is default, set new method default
    if (paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.isDefault) {
        const remainingMethods = yield prisma_1.default.paymentMethod.findMany({
            where: {
                userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
            },
            take: 1
        });
        if (remainingMethods.length > 0) {
            yield prisma_1.default.paymentMethod.update({
                where: {
                    id: remainingMethods[0].id
                },
                data: {
                    isDefault: true
                }
            });
        }
        // update stripe customer default
        if (user.stripeCustomerId) {
            yield stripe.customers.update(user.stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: remainingMethods[0].stripePaymentMethodId
                }
            });
        }
    }
    return result;
});
exports.StripeService = {
    paymentIntent,
    savePaymentInfo,
    createSetupIntent,
    savePaymentMethod,
    getPaymentMethods,
    processPayment,
    setDefaultPaymentMethod,
    deletePaymentMethod
};
