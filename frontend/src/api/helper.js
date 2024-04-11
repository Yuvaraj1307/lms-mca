import { deleteAPI, getAPI, postAPI, putAPI } from "./api"

const USER = '/user';
const MEMBER = '/member';
const BOOK = '/book';
const TRANSACTION = '/transaction';
const LOGIN = '/login';

export const getAllUsers = async (params = {}) => await getAPI(USER, params);

export const createUser = async (params) => await postAPI(USER, params);

export const updateUser = async (params) => await putAPI(USER, params);

export const deleteUser = async (user_uid) => await deleteAPI(USER, { user_uid });


export const getAllMembers = async () => await getAPI(MEMBER);

export const createMember = async (params) => await postAPI(MEMBER, params);

export const updateMember = async (params) => await putAPI(MEMBER, params);

export const deleteMember = async (member_uid) => await deleteAPI(MEMBER, { member_uid });


export const getAllBooks = async () => await getAPI(BOOK);

export const createBook = async (params) => await postAPI(BOOK, params);

export const updateBook = async (params) => await putAPI(BOOK, params);

export const deleteBook = async (book_uid) => await deleteAPI(BOOK, { book_uid });


export const getAllTransactions = async (params = {}) => await getAPI(TRANSACTION, params);

export const createTransaction = async (params) => await postAPI(TRANSACTION, params);

export const updateTransaction = async (params) => await putAPI(TRANSACTION, params);

export const deleteTransaction = async (transaction_uid) => await deleteAPI(TRANSACTION, { transaction_uid });

export const getDetails = async (params) => await postAPI(LOGIN, params);