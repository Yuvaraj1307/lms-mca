import { useCallback, useEffect, useState } from "react";
import { message, Spin, Table, Col } from 'antd';
import { capitalize } from "lodash";
import dayjs from 'dayjs'
import { getAllBooks, getAllTransactions, getAllUsers } from "../api/helper";

const Dashboard = () => {
    const user = localStorage.getItem('user');
    const columns = [
        {
            key: 'title',
            dataIndex: 'title',
            title: 'Title',
        },
        {
            key: 'librarian',
            dataIndex: 'librarian',
            title: 'Librarian',
        },
        {
            key: 'transaction_type',
            dataIndex: 'transaction_type',
            title: 'Transaction Type',
            render: (transaction_type) => <>{capitalize(transaction_type)}</>

        },
        {
            key: 'transaction_date',
            dataIndex: 'transaction_date',
            title: 'Transaction Date',
            render: (date) => <>{date ? dayjs(date).format('DD-MM-YYYY') : null}</>,
        },
        {
            key: 'due_date',
            dataIndex: 'due_date',
            title: 'Due Date',
            render: (date) => <>{date ? dayjs(date).format('DD-MM-YYYY') : null}</>,
        },
        {
            key: 'return_date',
            dataIndex: 'return_date',
            title: 'Return Date',
            render: (date) => <>{date ? dayjs(date).format('DD-MM-YYYY') : null}</>,
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Status',
            render: (status) => <>{capitalize(status)}</>
        },
    ]
    const [transactions, setTransactions] = useState();
    const [loading, setLoading] = useState(true);
    const fetchAllDatas = useCallback(async () => {
        try {
            const [usersResponse, booksResponse, transactionsResponse] = await Promise.all([getAllUsers({ librarian: true }), getAllBooks(), getAllTransactions({ member_uid: user.user_uid })]);

            const responses = [usersResponse, booksResponse, transactionsResponse];

            if (responses.every(response => response && response.success)) {
                const usersData = usersResponse.data;
                const booksData = booksResponse.data;
                const transactionsData = transactionsResponse.data;

                const dataSource = transactionsData.map((transaction) => {
                    return {
                        ...transaction,
                        title: booksData.find((book) => book.book_uid === transaction.book_uid)?.title || '',
                        librarian: usersData.find((user) => user.user_uid === transaction.user_uid)?.username || '',
                    };
                });

                setTransactions(dataSource);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            message.error(error?.data || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [user.user_uid]);
    useEffect(() => {
        if (user) {
            fetchAllDatas()
        }
    }, [fetchAllDatas, user])
    return (
        <Spin spinning={loading} size="large">
            <Col span={24} className='container h-100'>
                <Table
                    dataSource={transactions}
                    columns={columns}
                    scroll={{ x: 'auto' }}
                />
            </Col>
        </Spin>
    )
}

export default Dashboard