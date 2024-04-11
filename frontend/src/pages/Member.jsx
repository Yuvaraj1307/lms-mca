import { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Button, Select, Spin, message, Table, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { startCase, capitalize, isEmpty } from 'lodash';
import { createMember, deleteMember, getAllMembers, updateMember } from '../api/helper';

const { Item, useForm } = Form;

const memberTypes = ['student', 'faculty_staff', 'others']

const Member = () => {
  const { mode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(!mode);
  const [deleteMemberUid, setDeleteMemberUid] = useState();

  const handleClickEditMember = (member) => {
    navigate('/member/edit', { state: member })
  }

  const columns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: 'Username',
    },
    {
      key: 'member_type',
      dataIndex: 'member_type',
      title: 'Type',
      render: (member_type) => <>{startCase(member_type)}</>
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
      render: (member) => (
        <Row style={{ gap: '20px' }}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickEditMember(member)}
          >
            <EditOutlined />
          </span>
          <Popconfirm
            title="Delete the member"
            description="Are you sure to delete this member?"
            onConfirm={handleDeleteMember}
            onCancel={() => setDeleteMemberUid()}
            okText="Yes"
            cancelText="No"
            open={deleteMemberUid === member.member_uid}
          >
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setDeleteMemberUid(member.member_uid)}
            >
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </Row>
      ),
    },
  ]

  const handleClickAdd = () => {
    navigate('/member/add');
  }

  const handleDeleteMember = async () => {
    try {
      const { success } = await deleteMember(deleteMemberUid);
      if (success) {
        message.success('Member deleted successfully')
        fetchMembers();
      } else {
        message.error('Failed to delete member')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to delete member')
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const { success, data = [] } = await getAllMembers();
      if (success) {
        setMembers(data);
      } else {
        message.error('Failed to fetch members')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to fetch members')
    } finally {
      setLoading(false);
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    let response;
    try {
      if (mode === 'edit') {
        response = await updateMember({ ...state, ...values })
      } else {
        response = await createMember(values)
      }
      const { success } = response;
      if (success) {
        navigate('/member');
        message.success(`Member ${mode === 'edit' ? 'updated' : 'created'}  successfully`);
        form.resetFields();
      } else {
        message.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} member`);
      }
    } catch (error) {
      message.error(error?.data || `Failed to ${mode === 'edit' ? 'update' : 'create'} member`);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    navigate('/member');
    form.resetFields();
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || isEmpty(user)) {
      navigate('/login');
      return;
    }
    if (!mode) {
      fetchMembers();
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
                    rules={[{
                      required: true,
                      message: 'Password is required'
                    }]}
                    label={'Password'}
                  >
                    <Input.Password placeholder='Enter Password' />
                  </Item>
                  <Item
                    name={'member_type'}
                    rules={[{
                      required: true,
                      message: 'Member Type is required'
                    }]}
                    label={'Member Type'}
                  >
                    <Select
                      options={memberTypes.map((value) => ({ label: startCase(value), value }))}
                      placeholder='Select Member Type'
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
                  Add Member
                </Button>
              </Row>
              <Table
                dataSource={members}
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

export default Member