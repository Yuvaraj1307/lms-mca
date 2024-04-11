import { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, Row, Button, Select, Spin, message, Table, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createBook, deleteBook, getAllBooks, updateBook } from '../api/helper';
import { capitalize, isEmpty, startCase } from 'lodash';

const { Item, useForm } = Form;

const genreTypes = [
  'fiction', 'non_fiction', 'science_fiction', 'mystery', 'thriller',
  'horror', 'romance', 'fantasy', 'biography', 'history', 'self_help',
  'poetry', 'drama', 'comedy', 'adventure', 'children', 'young_adult',
  'reference', 'cookbooks', 'travel', 'art', 'religion', 'science',
  'health', 'business', 'finance', 'technology', 'philosophy', 'education',
  'sports', 'fitness', 'music', 'entertainment', 'other'
]

const Book = () => {
  const { mode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(!mode);
  const [deleteBookUid, setDeleteBookUid] = useState();

  const columns = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
    },
    {
      key: 'author',
      dataIndex: 'author',
      title: 'Author',
    },
    {
      key: 'genre',
      dataIndex: 'genre',
      title: 'Genre',
    },
    {
      key: 'quantity_available',
      dataIndex: 'quantity_available',
      title: 'Quantity Available',
    },
    {
      key: 'quantity_total',
      dataIndex: 'quantity_total',
      title: 'Quantity Total',
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
      render: (book) => (
        <Row style={{ gap: '20px' }}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickEditBook(book)}
          >
            <EditOutlined />
          </span>
          <Popconfirm
            title="Delete the book"
            description="Are you sure to delete this book?"
            onConfirm={handleDeleteBook}
            onCancel={() => setDeleteBookUid()}
            okText="Yes"
            cancelText="No"
            open={deleteBookUid === book.book_uid}
          >
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setDeleteBookUid(book.book_uid)}
            >
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </Row>
      ),
    },
  ]

  const handleClickAdd = () => {
    navigate('/book/add');
  }

  const handleClickEditBook = (book) => {
    navigate('/book/edit', { state: book })
  }

  const handleDeleteBook = async () => {
    try {
      const { success } = await deleteBook(deleteBookUid);
      if (success) {
        message.success('Book deleted successfully')
        fetchBooks();
      } else {
        message.error('Failed to delete book')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to delete book')
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const { success, data = [] } = await getAllBooks();
      if (success) {
        setBooks(data);
      } else {
        message.error('Failed to fetch books')
      }
    } catch (error) {
      message.error(error?.data || 'Failed to fetch books')
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
        response = await updateBook({ ...state, ...payload })
      } else {
        response = await createBook(payload)
      }
      const { success } = response;
      if (success) {
        navigate('/book');
        message.success(`Book ${mode === 'edit' ? 'updated' : 'created'}  successfully`);
        form.resetFields();
      } else {
        message.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} book`);
      }
    } catch (error) {
      message.error(error?.data || `Failed to ${mode === 'edit' ? 'update' : 'create'} book`);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    navigate('/book');
    form.resetFields();
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || isEmpty(user)) {
      navigate('/login');
      return;
    }
    if (!mode) {
      fetchBooks();
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
                    name={'title'}
                    rules={[{
                      required: true,
                      message: 'Title is required'
                    }]}
                    label={'Title'}
                  >
                    <Input placeholder='Enter Title' />
                  </Item>
                  <Item
                    name={'author'}
                    label={'Author'}
                    rules={[{
                      required: true,
                      message: 'Author is required'
                    }]}
                  >
                    <Input placeholder='Enter Author' />
                  </Item>
                  <Item
                    name={'genre'}
                    rules={[{
                      required: true,
                      message: 'Genre is required'
                    }]}
                    label={'Genre'}
                  >
                    <Select
                      options={genreTypes.map((value) => ({ label: startCase(value), value }))}
                      placeholder='Select Genre'
                      showSearch={true}
                    />
                  </Item>
                  <Item
                    name={'quantity_available'}
                    label={'Quantity Available'}
                    rules={[{
                      required: true,
                      message: 'Quantity Available is required'
                    }]}
                  >
                    <InputNumber placeholder='Enter Quantity Available' />
                  </Item>
                  <Item
                    name={'quantity_total'}
                    label={'Total'}
                    rules={[{
                      required: true,
                      message: 'Quantity Total is required'
                    }]}
                  >
                    <InputNumber placeholder='Enter Quantity Total' />
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
                  Add Book
                </Button>
              </Row>
              <Table
                dataSource={books}
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

export default Book