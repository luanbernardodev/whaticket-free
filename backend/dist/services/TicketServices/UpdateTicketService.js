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
const CheckContactOpenTickets_1 = __importDefault(require("../../helpers/CheckContactOpenTickets"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../../helpers/SetTicketMessagesAsRead"));
const socket_1 = require("../../libs/socket");
const ShowTicketService_1 = __importDefault(require("./ShowTicketService"));
const UpdateTicketService = ({ ticketData, ticketId }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { status, userId, queueId, whatsappId } = ticketData;
    const ticket = yield (0, ShowTicketService_1.default)(ticketId);
    yield (0, SetTicketMessagesAsRead_1.default)(ticket);
    if (whatsappId && ticket.whatsappId !== whatsappId) {
        yield (0, CheckContactOpenTickets_1.default)(ticket.contactId, whatsappId);
    }
    const oldStatus = ticket.status;
    const oldUserId = (_a = ticket.user) === null || _a === void 0 ? void 0 : _a.id;
    if (oldStatus === "closed") {
        yield (0, CheckContactOpenTickets_1.default)(ticket.contact.id, ticket.whatsappId);
    }
    yield ticket.update({
        status,
        queueId,
        userId
    });
    if (whatsappId) {
        yield ticket.update({
            whatsappId
        });
    }
    yield ticket.reload();
    const io = (0, socket_1.getIO)();
    if (ticket.status !== oldStatus || ((_b = ticket.user) === null || _b === void 0 ? void 0 : _b.id) !== oldUserId) {
        io.to(oldStatus).to(`queue-${ticket.queueId}-${oldStatus}`).emit("ticket", {
            action: "delete",
            ticketId: ticket.id
        });
    }
    io.to(ticket.status)
        .to("notification")
        .to(ticketId.toString())
        // send queue specific messages
        .to(`queue-${ticket.queueId}-${ticket.status}`)
        .to(`queue-${ticket.queueId}-notification`)
        .emit("ticket", {
        action: "update",
        ticket
    });
    return { ticket, oldStatus, oldUserId };
});
exports.default = UpdateTicketService;
