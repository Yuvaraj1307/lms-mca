import { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Button, Select, Spin, message, Table, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createUser, deleteUser, getAllUsers, updateUser } from '../api/helper';
import { capitalize, isEmpty, startCase } from 'lodash';

const { Item, useForm } = Form;

const userTypes = ['admin', 'librarian']

const User = () => {
  const { mode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(!mode);
  const [deleteUserUid, setDeleteUserUid] = useState();

  const columns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: 'User Name',
    },
    {
      key: 'user_type',
      dataIndex: 'user_type',
      title: 'User Type',
    },
    {
      key: 'contact_information',
      dataIndex: 'contact_information',
      title: 'Contact Information',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status) => <>{capitalize(status)}</>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (user) => (
        <Row style={{ gap: '20px' }}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickEditUser(user)}
          >
            <EditOutlined />
          </span>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={handleDeleteUser}
            onCancel={() => setDeleteUserUid()}
            okText="Yes"
            cancelText="No"
            open={deleteUserUid === user.user_uid}
          >
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setDeleteUserUid(user.user_uid)}
            >
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </Row>
      ),
    },
  ]

  const handleClickAdd = () => {
    navigate('/user/add');
  }

  const handleClickEditUser = (user) => {
    navigate('/user/edit', { state: user })
  }

  const handleDeleteUser = async () => {
    try {
      const { success } = await deleteUser(deleteUserUid);
      if (success) {
        message.success('User deleted successfully')
        fetchUsers();
      } else {
        message.error('Failed to delete user')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { success, data = [] } = await getAllUsers();
      if (success) {
        setUsers(data);
      } else {
        message.error('Failed to fetch users')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to fetch users')
    } finally {
      setLoading(false);
    }
  }

  const onFinish = async (values) => {
    const payload = { ...values, status: values.status ? 'active' : 'inactive' };
    setLoading(true);
    let response;
    try {
      if (mode === 'edit') {
        response = await updateUser({ ...state, ...payload })
      } else {
        response = await createUser(payload)
      }
      const { success } = response;
      if (success) {
        navigate('/user');
        message.success(`User ${mode === 'edit' ? 'updated' : 'created'}  successfully`);
        form.resetFields();
      } else {
        message.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} user`);
      }
    } catch (error) {
      message.error(error?.data || `Failed to ${mode === 'edit' ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    navigate('/user');
    form.resetFields();
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || isEmpty(user)) {
      navigate('/login');
      return;
    }
    if (!mode) {
      fetchUsers();
    }

    if (mode === 'edit' && state) {
      form.setFieldsValue({ ...state, status: state.status === 'active' ? true : false });
    } else {
      form.setFieldsValue({ status: true })
    }
  }, [form, mode, navigate, state]);

  return (
    <Spin
      spinning={loading}
      className='h-100'
      size='large'
    >
      <Col span={24} className='container h-100'>
        {
          (mode && (mode === 'add' || mode === 'edit')) ? (
            <Row className='h-100' justify='center' align='middle'>
              <Col xl={10} lg={12} md={14} sm={20} xs={24}>
                <Form
                  form={form}
                  layout='vertical'
                  autoComplete='off'
                  onFinish={onFinish}
                  className='form-container'
                >
                  <Item
                    name={'username'}
                    rules={[{
                      required: true,
                      message: 'Username is required'
                    }]}
                    label={'Username'}
                  >
                    <Input placeholder='Enter Username' />
                  </Item>
                  <Item
                    name={'password'}
                    label={'Password'}
                    rules={[{
                      required: true,
                      message: 'Password is required'
                    }]}
                  >
                    <Input.Password placeholder='Enter Password' />
                  </Item>
                  <Item
                    name={'user_type'}
                    rules={[{
                      required: true,
                      message: 'User Type is required'
                    }]}
                    label={'User Type'}
                  >
                    <Select
                      options={userTypes.map((value) => ({ label: startCase(value), value }))}
                      placeholder='User Type'
                      showSearch={true}
                    />
                  </Item>
                  <Item
                    name={'contact_information'}
                    label={'Contact Information'}
                    rules={[{
                      required: true,
                      message: 'Contact Information is required'
                    }]}
                  >
                    <Input placeholder='Enter Contact Information' />
                  </Item>
                  <Item
                    name={'status'}
                    label={'Active Status'}
                  >
                    <Switch />
                  </Item>
                  <Item>
                    <Row justify='end' style={{ gap: '15px', marginTop: '20px' }}>
                      <Button
                        htmlType='reset'
                        size='large'
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='primary'
                        size='large'
                        htmlType='submit'
                        loading={loading}
                        disabled={loading}
                      >
                        {
                          mode === 'edit' ? 'Update' : 'Create'
                        }
                      </Button>
                    </Row>
                  </Item>
                </Form>
              </Col>
            </Row>
          ) : (
            <>
              <Row justify='end' style={{ marginBottom: '10px' }}>
                <Button
                  type='primary'
                  size='large'
                  onClick={handleClickAdd}
                  icon={<PlusOutlined />}
                >
                  Add User
                </Button>
              </Row>
              <Table
                dataSource={users}
                columns={columns}
                scroll={{ x: 'auto' }}
              />
            </>
          )
        }
      </Col>
    </Spin>
  )
}

export default User