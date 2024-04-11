import { Form, Input, Button, Col, Row, message, Spin, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { getDetails } from '../api/helper';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const defaultMenus = [
    {
        key: 'book',
        label: 'Book',
    },
    {
        key: 'member',
        label: 'Member',
    },
    {
        key: 'transaction',
        label: 'Transaction',
    },
];

// eslint-disable-next-line react/prop-types
const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { success, data } = await getDetails(values);
            if (success) {
                if (!isEmpty(data)) {
                    const { user_type } = data;
                    if (!user_type) {
                        navigate('/login');
                        return;
                    } else {
                        if (user_type === 'admin') {
                            localStorage.setItem('menus', JSON.stringify([...defaultMenus, { key: 'user', label: 'User' }]))
                        } else if (user_type === 'librarian') {
                            localStorage.setItem('menus', JSON.stringify(defaultMenus))
                        } else if (user_type === 'member') {
                            localStorage.setItem('menus', JSON.stringify([{ key: 'dashboard', label: 'Dashboard' }]));
                        }
                        message.success('Logged in successfully');
                        localStorage.setItem('user', JSON.stringify(data));
                        setIsLoggedIn(true);
                        if (user_type === 'member') {
                            location.pathname = '/dashboard';
                        } else {
                            location.pathname = '/book';
                        }
                    }
                } else {
                    message.error('Invalid Username or Password')
                }
            } else {
                message.error('An error occurred while logging in');
            }
        } catch (error) {
            message.error(error?.data || 'An error occurred while logging in');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('menus');
        setLoading(false);
    }, [])

    return (
        <Spin spinning={loading} size='large'>
            <Col span={24} className='container h-100' style={{
                backgroundColor: '#8ae9b3',
                backgroundImage: 'linear-gradient(315deg, #8ae9b3 0%, #c8d6e5 74%)',
            }}>
                <Row className='h-100' justify='center' align='middle'>
                    <Form
                        name="login"
                        className='form-container login-container'
                        onFinish={onFinish}
                        autoComplete='off'
                    >
                        <Row>
                            <Col span={24}>
                                <Title level={4} style={{ marginBottom: '0', color: '#00b96b', textAlign: 'center' }}>
                                    Login to LMS
                                </Title>
                            </Col>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Username!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Password!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Row>
                        <Col span={24} style={{ alignSelf: 'end' }}>
                            <Form.Item className='login-btn'>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    size='large'
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Log in
                                </Button>
                            </Form.Item>
                        </Col>
                    </Form>
                </Row>
            </Col>
        </Spin>
    )
}

export default Login