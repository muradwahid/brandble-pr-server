// import { ChatRoom } from "@prisma/client";
// import { chatPrisma } from "../../../shared/chatprisma";
// import { ITokenUser } from "./chat.interface";

// const createChatRoom = async (data:any) => { 
//   const { orderId, title, description, participantIds, createdBy } = data;
//   const order = await chatPrisma.order.findUnique({
//     where: {
//       id: orderId,
//     },
//     include: { user: true }
//   })

//   if (!order) {
//     throw new Error('Order not found');
//   }

//   // Create chat room with participants
//   const chatRoom = await chatPrisma.chatRoom.create({
//     data: {
//       orderId,
//       title,
//       description,
//       participants: {
//         create: [
//           // Add order owner
//           { userId: order.userId, role: 'user' },
//           // Add creator if not already included
//           ...(createdBy !== order.userId ? [{ userId: createdBy, role: 'user' }] : []),
//           // Add other participants
//           ...participantIds
//             .filter((id: string) => id !== order.userId && id !== createdBy)
//             .map((userId: string) => ({ userId, role: 'user' }))
//         ]
//       }
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true
//         }
//       }
//     }
//   });
//   return chatRoom;
// }

// const getChatRoomByOrder = async (orderId: string) => {
//   const chatRoom = await chatPrisma.chatRoom.findUnique({
//     where: { orderId },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       messages: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         },
//         orderBy: {
//           createdAt: 'asc'
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true,
//           amount: true
//         }
//       }
//     }
//   });

//   if (!chatRoom) {
//     throw new Error('Chat room not found');
//   }

//   return chatRoom;
// }

// const sendMessage = async (data: any) => { 
//   const { roomId, userId, content, type = 'text', fileUrl = null } = data;
//   // Verify user has access to room
//   const canAccess = await canUserAccessRoom(roomId, userId);
//   if (!canAccess.success) {
//     throw new Error('Access denied to chat room');
//   }

//   // Create message
//   const message = await chatPrisma.chatMessage.create({
//     data: {
//       roomId,
//       userId,
//       content,
//       type,
//       fileUrl,
//       readBy: [userId] // Mark as read by sender
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       },
//       room: {
//         select: {
//           id: true,
//           roomId: true,
//           title: true
//         }
//       }
//     }
//   });
// }

// const canUserAccessRoom = async (roomId: string, userId: string) => {
//   try {
//     const participant = await chatPrisma.chatParticipant.findUnique({
//       where: {
//         roomId_userId: {
//           roomId,
//           userId
//         }
//       }
//     });

//     return {
//       success: !!participant,
//       data: participant
//     };
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     return {
//       success: false,
//       error: message
//     };
//   }
// }

// const getUserChatRooms = async (user:any) => { 
//   const { id: userId } = user;
//   const chatRooms = await chatPrisma.chatRoom.findMany({
//     where: {
//       participants: {
//         some: {
//           userId
//         }
//       }
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       messages: {
//         orderBy: {
//           createdAt: 'desc'
//         },
//         take: 1,
//         include: {
//           user: {
//             select: {
//               name: true
//             }
//           }
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true,
//           amount: true
//         }
//       }
//     },
//     orderBy: {
//       updatedAt: 'desc'
//     }
//   });
//   return chatRooms;
// }

// const addParticipant = async (roomId:string, user:any) => {
//   const { id: userId,role } = user;
//   const participant = await chatPrisma.chatParticipant.create({
//     data: {
//       roomId,
//       userId,
//       role
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       }
//     }
//   });
//   return participant;
// }

// const markMessagesAsRead = async (roomId: string, user: any) => { 
//   const { id: userId } = user;
//   // Get unread messages
//   const unreadMessages = await chatPrisma.chatMessage.findMany({
//     where: {
//       roomId,
//       NOT: {
//         readBy: {
//           has: userId
//         }
//       }
//     }
//   });

//   // Update each message to mark as read
//   for (const message of unreadMessages) {
//     await chatPrisma.chatMessage.update({
//       where: { id: message.id },
//       data: {
//         readBy: {
//           push: userId
//         }
//       }
//     });
//   }
//   return unreadMessages
// }

// const assignAdmin = async (data:any,user:ITokenUser) => { 
//   const { adminId, orderId } = data;
//   const { id: userId, role } = user;
//   // Verify admin user exists and has admin role
//   const adminUser = await chatPrisma.user.findUnique({
//     where: { id: adminId },
//     select: { id: true, role: true }
//   });

//   if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
//     throw new Error('User is not an admin');
//   }

//   // Create admin assignment
//   const assignment = await chatPrisma.adminAssignment.create({
//     data: {
//       adminId,
//       userId,
//       orderId,
//       role
//     },
//     include: {
//       admin: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       },
//       user: userId ? {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true
//         }
//       } : false,
//       order: orderId ? {
//         select: {
//           id: true,
//           orderId: true,
//           status: true
//         }
//       } : false
//     }
//   });
//   return assignment;
// }

// const getOrderAdmins = async (orderId:string) => { 
//   const assignments = await chatPrisma.adminAssignment.findMany({
//     where: {
//       orderId,
//       status: 'active'
//     },
//     include: {
//       admin: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       }
//     }
//   });

//   return assignments;
// }
// const getAllActiveAdmins = async () => { 
//   const admins = await chatPrisma.user.findMany({
//     where: {
//       role: {
//         in: ['admin', 'super_admin']
//       }
//     },
//     select: {
//       id: true,
//       userId: true,
//       name: true,
//       email: true,
//       role: true,
//       image: true,
//       company: true,
//       designation: true
//     }
//   });
//   return admins;
// }

// export const ChatService = {
//   createChatRoom,
//   getChatRoomByOrder,
//   sendMessage,
//   getUserChatRooms,
//   addParticipant,
//   markMessagesAsRead,
//   assignAdmin,
//   getOrderAdmins,
//   getAllActiveAdmins,
//   canUserAccessRoom
// }

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const chatService = {
//   // Get or create chat room for user-admin communication
//   async getOrCreateUserAdminRoom(userId: string, adminId: string) {
//     let chatRoom = await prisma.chatRoom.findFirst({
//       where: {
//         userId,
//         adminId,
//         orderId: null
//       },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           }
//         },
//         messages: {
//           include: {
//             sender: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           },
//           orderBy: {
//             createdAt: 'asc'
//           }
//         }
//       }
//     });

//     if (!chatRoom) {
//       chatRoom = await prisma.chatRoom.create({
//         data: {
//           userId,
//           adminId,
//           participants: {
//             create: [
//               { userId },
//               { userId: adminId }
//             ]
//           }
//         },
//         include: {
//           participants: {
//             include: {
//               user: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   role: true,
//                   image: true
//                 }
//               }
//             }
//           },
//           messages: {
//             include: {
//               sender: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   role: true,
//                   image: true
//                 }
//               }
//             },
//             orderBy: {
//               createdAt: 'asc'
//             }
//           }
//         }
//       });
//     }

//     return chatRoom;
//   },

//   // Get or create order-specific chat room
//   async getOrCreateOrderRoom(orderId: string, userId: string, adminId: string) {
//     let chatRoom = await prisma.chatRoom.findFirst({
//       where: {
//         orderId
//       },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           }
//         },
//         messages: {
//           include: {
//             sender: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           },
//           orderBy: {
//             createdAt: 'asc'
//           }
//         },
//         order: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 email: true
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!chatRoom) {
//       chatRoom = await prisma.chatRoom.create({
//         data: {
//           orderId,
//           userId,
//           adminId,
//           participants: {
//             create: [
//               { userId },
//               { userId: adminId }
//             ]
//           }
//         },
//         include: {
//           participants: {
//             include: {
//               user: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   role: true,
//                   image: true
//                 }
//               }
//             }
//           },
//           messages: {
//             include: {
//               sender: {
//                 select: {
//                   id: true,
//                   name: true,
//                   email: true,
//                   role: true,
//                   image: true
//                 }
//               }
//             },
//             orderBy: {
//               createdAt: 'asc'
//             }
//           },
//           order: {
//             include: {
//               user: {
//                 select: {
//                   name: true,
//                   email: true
//                 }
//               }
//             }
//           }
//         }
//       });
//     }

//     return chatRoom;
//   },

//   // Send message
//   async sendMessage(chatRoomId: string, senderId: string, content: string, messageType: string = 'text') {
//     const message = await prisma.chatMessage.create({
//       data: {
//         content,
//         senderId,
//         chatRoomId,
//         messageType
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//             image: true
//           }
//         }
//       }
//     });

//     return message;
//   },

//   // Get user chat rooms (for admin dashboard)
//   async getUserChatRooms(adminId: string) {
//     return await prisma.chatRoom.findMany({
//       where: {
//         adminId,
//         orderId: null
//       },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           }
//         },
//         messages: {
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 1
//         },
//         user: {
//           select: {
//             name: true,
//             email: true
//           }
//         }
//       },
//       orderBy: {
//         updatedAt: 'desc'
//       }
//     });
//   },

//   // Get order chat rooms (for admin dashboard)
//   async getOrderChatRooms(adminId: string) {
//     return await prisma.chatRoom.findMany({
//       where: {
//         adminId,
//         orderId: { not: null }
//       },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           }
//         },
//         messages: {
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 1
//         },
//         order: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 email: true
//               }
//             }
//           }
//         }
//       },
//       orderBy: {
//         updatedAt: 'desc'
//       }
//     });
//   },

//   // Get user's chat rooms
//   async getUserChats(userId: string) {
//     return await prisma.chatRoom.findMany({
//       where: {
//         participants: {
//           some: {
//             userId
//           }
//         }
//       },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 image: true
//               }
//             }
//           }
//         },
//         messages: {
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 1
//         },
//         order: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 email: true
//               }
//             }
//           }
//         }
//       },
//       orderBy: {
//         updatedAt: 'desc'
//       }
//     });
//   }
// };

// src/services/chatService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const chatService = {
  // Get or create chat room for user-admin communication (first time chat)
  async getOrCreateUserAdminRoom(userId: string, adminId: string) {
    try {
      // First, try to find existing chat room without order
      let chatRoom = await prisma.chatRoom.findFirst({
        where: {
          userId,
          adminId,
          orderId: null
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          },
          admin: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      // If chat room doesn't exist, create a new one
      if (!chatRoom) {
        chatRoom = await prisma.chatRoom.create({
          data: {
            userId,
            adminId,
            participants: {
              create: [
                { userId: userId },
                { userId: adminId }
              ]
            }
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                  }
                }
              }
            },
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            },
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            },
            admin: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
      }

      return chatRoom;
    } catch (error) {
      console.error('Error in getOrCreateUserAdminRoom:', error);
      throw error;
    }
  },

  // Get or create order-specific chat room (first time order chat)
  async getOrCreateOrderRoom(orderId: string, userId: string, adminId: string) {
    try {
      // First, try to find existing order chat room
      let chatRoom = await prisma.chatRoom.findFirst({
        where: {
          orderId
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          },
          admin: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      // If order chat room doesn't exist, create a new one
      if (!chatRoom) {
        chatRoom = await prisma.chatRoom.create({
          data: {
            orderId,
            userId,
            adminId,
            participants: {
              create: [
                { userId: userId },
                { userId: adminId }
              ]
            }
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                  }
                }
              }
            },
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            },
            order: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            },
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            },
            admin: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
      }

      return chatRoom;
    } catch (error) {
      console.error('Error in getOrCreateOrderRoom:', error);
      throw error;
    }
  },

  // Send first message in a chat room
  async sendFirstMessage(chatRoomId: string, senderId: string, content: string, messageType: string = 'text') {
    try {
      const message = await prisma.chatMessage.create({
        data: {
          content,
          senderId,
          chatRoomId,
          messageType
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true
            }
          }
        }
      });

      // Update chat room's updatedAt
      await prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: { updatedAt: new Date() }
      });

      return message;
    } catch (error) {
      console.error('Error in sendFirstMessage:', error);
      throw error;
    }
  },

  // Send message (general function)
  async sendMessage(chatRoomId: string, senderId: string, content: string, messageType: string = 'text') {
    console.log("chat service chatRoomId:", chatRoomId);
    console.log("chat service senderId:", senderId);
    console.log("chat service content:", content);
    console.log("chat service messageType:", messageType);
    return this.sendFirstMessage(chatRoomId, senderId, content, messageType);
  },

  // Get user chat rooms for admin dashboard
  async getUserChatRooms(adminId: string) {
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          adminId,
          orderId: null
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return chatRooms;
    } catch (error) {
      console.error('Error in getUserChatRooms:', error);
      throw error;
    }
  },

  async getClientChatRooms(clientId: string) { 
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          userId: clientId,
          orderId: null
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return chatRooms;
    } catch (error) {
      console.error('Error in getUserChatRooms:', error);
      throw error;
    }
  },

  // Get order chat rooms for admin dashboard
  async getOrderChatRooms(adminId: string) {
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          adminId,
          orderId: { not: null }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return chatRooms;
    } catch (error) {
      console.error('Error in getOrderChatRooms:', error);
      throw error;
    }
  },

  async getOrderUserChats(userId: string) { 
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          orderId: { not: null },
          user: {
            id: userId
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return chatRooms;
    } catch (error) {
      console.error('Error in getOrderChatRooms:', error);
      throw error;
    }
  },

  // Get user's chat rooms
  async getUserChats(userId: string) {
    try {
      const chatRooms = await prisma.chatRoom.findMany({
        where: {
          OR: [
            { userId },
            { participants: { some: { userId } } }
          ]
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          admin: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return chatRooms;
    } catch (error) {
      console.error('Error in getUserChats:', error);
      throw error;
    }
  },

  // Get chat room by ID
  async getChatRoom(chatRoomId: string) {
    try {
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            }
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          },
          admin: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      return chatRoom;
    } catch (error) {
      console.error('Error in getChatRoom:', error);
      throw error;
    }
  },

  // Check if user can access chat room
  async canUserAccessChat(userId: string, chatRoomId: string) {
    try {
      const chatRoom = await prisma.chatRoom.findFirst({
        where: {
          id: chatRoomId,
          OR: [
            { userId },
            { adminId: userId },
            { participants: { some: { userId } } }
          ]
        }
      });

      return !!chatRoom;
    } catch (error) {
      console.error('Error in canUserAccessChat:', error);
      return false;
    }
  }
};