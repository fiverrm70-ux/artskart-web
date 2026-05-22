import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { getCategories, type Category } from '../../api/categoriesApi';
import { addProductImage, createProduct } from '../../api/productsApi';
import { uploadImage } from '../../api/uploadApi';

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type UploadedGalleryImage = {
  url: string;
  publicId: string;
};

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

function ProductFormModal({ open, onClose, onSuccess }: ProductFormModalProps) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<UploadedGalleryImage[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (!open) return;

    getCategories()
      .then(setCategories)
      .catch(() => message.error('Failed to load categories'));
  }, [open]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setFieldValue('slug', createSlug(title));
  };

  const uploadMainImage = async (file: File) => {
    try {
      setUploadingMain(true);
      message.loading({
        content: 'Uploading main image...',
        key: 'mainUpload',
      });

      const result = await uploadImage(file);

      setMainImage(result.url);
      form.setFieldValue('imageUrl', result.url);

      message.success({
        content: 'Main image uploaded successfully',
        key: 'mainUpload',
      });
    } catch (error) {
      console.error(error);
      message.error({ content: 'Main image upload failed', key: 'mainUpload' });
    } finally {
      setUploadingMain(false);
    }
  };

  const uploadGalleryImage = async (file: File) => {
    try {
      setUploadingGallery(true);
      message.loading({
        content: 'Uploading gallery image...',
        key: 'galleryUpload',
      });

      const result = await uploadImage(file);

      setGalleryImages((current) => [...current, result]);

      message.success({
        content: 'Gallery image uploaded successfully',
        key: 'galleryUpload',
      });
    } catch (error) {
      console.error(error);
      message.error({
        content: 'Gallery image upload failed',
        key: 'galleryUpload',
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  type ProductFormValues = {
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    imageUrl: string;
    price: number;
    comparePrice?: number;
    stock?: number;
    sku?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    categoryId: string;
    artworkSize?: string;
    artworkMaterial?: string;
    printQuality?: string;
    packaging?: string;
    productStory?: string;
    detailStyle?: string;
    detailTheme?: string;
    detailSize?: string;
    detailMaterial?: string;
    craftMaterials?: string;
    certificatePoints?: string;
    careGuidance?: string;
    framingSupport?: string;
    serviceNotes?: string;
    reviewNotes?: string;
  };

  const handleFinish = async (values: ProductFormValues) => {
    try {
      setSubmitting(true);

      const createdProduct = await createProduct({
        title: values.title,
        slug: values.slug,
        description: values.description,
        shortDescription: values.shortDescription,
        imageUrl: values.imageUrl,
        price: Number(values.price),
        comparePrice: values.comparePrice
          ? Number(values.comparePrice)
          : undefined,
        stock: Number(values.stock || 0),
        sku: values.sku,
        isFeatured: Boolean(values.isFeatured),
        isActive: values.isActive !== false,
        categoryId: values.categoryId,

        artworkSize: values.artworkSize,
        artworkMaterial: values.artworkMaterial,
        printQuality: values.printQuality,
        packaging: values.packaging,
        productStory: values.productStory,
        detailStyle: values.detailStyle,
        detailTheme: values.detailTheme,
        detailSize: values.detailSize,
        detailMaterial: values.detailMaterial,
        craftMaterials: values.craftMaterials,
        certificatePoints: values.certificatePoints,
        careGuidance: values.careGuidance,
        framingSupport: values.framingSupport,
        serviceNotes: values.serviceNotes,
        reviewNotes: values.reviewNotes,
      });

      await Promise.all(
        galleryImages.map((image, index) =>
          addProductImage(createdProduct.id, {
            imageUrl: image.url,
            altText: values.title,
            sortOrder: index + 1,
          }),
        ),
      );

      message.success('Product created successfully');
      form.resetFields();
      setMainImage('');
      setGalleryImages([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add New Product"
      open={open}
      onCancel={onClose}
      footer={null}
      width={920}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          stock: 0,
          isFeatured: false,
          isActive: true,
          artworkSize: '13 × 19 inches',
          artworkMaterial: 'Unframed Fine Art Print',
          printQuality: '300 GSM Archival Paper',
          packaging: 'Protective sleeve and secure courier packaging',
          serviceNotes:
            'Produced in small batches for consistency, quality and attention to detail.',
          certificatePoints:
            'Thank you card included\nHand-signed certificate of authenticity\nSigned and numbered artwork\nArtskart authenticity seal',
          careGuidance:
            'Keep away from direct sunlight\nFrame under glass for archival protection\nHandle with clean, dry hands\nStore flat in protective sleeve when not framed',
          framingSupport:
            'Framing advice and curated frame suggestions will be shared after purchase based on your region.',
          craftMaterials:
            'Print — 300 GSM archival quality paper\nBacking — support board when required\nProtection Sleeve — moisture-safe protection\nPackaging — secure courier packaging',
          reviewNotes:
            'Beautiful print quality. Looks even better in person.\nPackaging was excellent and the artwork feels truly premium.',
        }}
      >
        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: 'Product title is required' }]}
        >
          <Input
            placeholder="Vishnu and Lakshmi in Eternal Harmony"
            onChange={handleTitleChange}
          />
        </Form.Item>

        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
          <Input placeholder="vishnu-lakshmi-eternal-harmony" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select category"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="imageUrl" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Main Image" required>
          <Upload
            beforeUpload={(file) => {
              uploadMainImage(file);
              return false;
            }}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={uploadingMain}>
              {mainImage ? 'Change Main Image' : 'Upload Main Image'}
            </Button>
          </Upload>

          {mainImage && (
            <div style={{ marginTop: 12 }}>
              <Image
                src={mainImage}
                width={130}
                height={130}
                style={{ objectFit: 'cover', borderRadius: 12 }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item label="Gallery Images">
          <Upload
            beforeUpload={(file) => {
              uploadGalleryImage(file);
              return false;
            }}
            multiple
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={uploadingGallery}>
              Upload Gallery Images
            </Button>
          </Upload>

          {galleryImages.length > 0 && (
            <Space wrap style={{ marginTop: 12 }}>
              {galleryImages.map((image) => (
                <Image
                  key={image.publicId}
                  src={image.url}
                  width={90}
                  height={90}
                  style={{ objectFit: 'cover', borderRadius: 10 }}
                />
              ))}
            </Space>
          )}
        </Form.Item>

        <Divider>Basic Product Details</Divider>

        <Form.Item label="Short Description" name="shortDescription">
          <Input placeholder="A timeless expression of harmony and divine balance." />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Full product description" />
        </Form.Item>

        <Form.Item label="Product Story" name="productStory">
          <Input.TextArea rows={5} placeholder="Story section content" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Compare Price" name="comparePrice">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Stock" name="stock">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="SKU" name="sku">
          <Input placeholder="AK-001" />
        </Form.Item>

        <Divider>Frontend Product Detail Fields</Divider>

        <Form.Item label="Artwork Size" name="artworkSize">
          <Input placeholder="13 × 19 inches" />
        </Form.Item>

        <Form.Item label="Artwork Material" name="artworkMaterial">
          <Input placeholder="Unframed Fine Art Print" />
        </Form.Item>

        <Form.Item label="Print Quality" name="printQuality">
          <Input placeholder="300 GSM Archival Paper" />
        </Form.Item>

        <Form.Item label="Packaging" name="packaging">
          <Input placeholder="Protective packaging" />
        </Form.Item>

        <Form.Item label="Detail - Style" name="detailStyle">
          <Input placeholder="Indian Traditional" />
        </Form.Item>

        <Form.Item label="Detail - Theme" name="detailTheme">
          <Input placeholder="Mythology, divinity, cosmic balance" />
        </Form.Item>

        <Form.Item label="Detail - Size" name="detailSize">
          <Input placeholder="13 × 19 inches" />
        </Form.Item>

        <Form.Item label="Detail - Material" name="detailMaterial">
          <Input placeholder="300 GSM archival paper" />
        </Form.Item>

        <Form.Item label="Craft & Materials" name="craftMaterials">
          <Input.TextArea rows={5} placeholder="One point per line" />
        </Form.Item>

        <Form.Item label="Certificate Points" name="certificatePoints">
          <Input.TextArea rows={4} placeholder="One point per line" />
        </Form.Item>

        <Form.Item label="Care Guidance" name="careGuidance">
          <Input.TextArea rows={4} placeholder="One point per line" />
        </Form.Item>

        <Form.Item label="Framing Support" name="framingSupport">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Service Strip Note" name="serviceNotes">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Review Notes" name="reviewNotes">
          <Input.TextArea rows={3} placeholder="One review per line" />
        </Form.Item>

        <Form.Item
          label="Featured Product"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Active Product"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block
          style={{
            height: 44,
            borderRadius: 10,
            background: '#A77833',
            borderColor: '#A77833',
            fontWeight: 700,
          }}
        >
          Create Product
        </Button>
      </Form>
    </Modal>
  );
}

export default ProductFormModal;
