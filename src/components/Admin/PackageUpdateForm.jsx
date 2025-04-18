import React, { useState } from "react";
import { Button, Modal, Input, Select, Form, InputNumber, message } from "antd";
import { updateServicePackage } from "../../Services/serviceApi";

const { Option } = Select;

const PackageUpdateForm = ({ packageInfo, fetchPackageDetails }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Check if services are in use to disable edit button
  const isServicesInUse = packageInfo?.totalServiceIsUseNow > 0;

  const handleOpenModal = () => {
    form.setFieldsValue({
      type: packageInfo?.type || "",
      highLightTime: packageInfo?.highLightTime || 0,
      priorityTime: packageInfo?.priorityTime || 0,
      maxPost: packageInfo?.maxPost || null,
      label: packageInfo?.label || "",
      status: packageInfo?.status || "Active"
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdatePackage = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      await updateServicePackage(
        packageInfo.packageId,
        values.type,
        values.highLightTime,
        values.priorityTime,
        values.maxPost,
        values.label,
        values.status
      );
      
      message.success("Package updated successfully!");
      setIsUpdateModalOpen(false);
      fetchPackageDetails();
    } catch (error) {
      message.error(error.message || "Failed to update package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleOpenModal}
        disabled={isServicesInUse}
        title={isServicesInUse ? "Cannot edit while any service is in use" : "Edit package details"}
        className="edit-package-button"
        style={{
          backgroundColor: "#3b82f6",
          borderRadius: "8px",
          fontWeight: "500",
          border: "none",
        }}
      >
        <span style={{ marginRight: 4 }}>✏️</span> Edit Package
      </Button>

      <Modal
        title="✏️ Update Package Details"
        open={isUpdateModalOpen}
        onOk={handleUpdatePackage}
        onCancel={() => setIsUpdateModalOpen(false)}
        okText="Update"
        confirmLoading={loading}
        className="package-update-modal"
      >
        <Form
          form={form}
          layout="vertical"
          className="modal-form"
        >
          <Form.Item
            name="type"
            label="Package Type"
            rules={[{ required: true, message: "Please input package type!" }]}
          >
            <Input placeholder="📦 Package Type" />
          </Form.Item>

          <Form.Item
            name="highLightTime"
            label="⭐ Highlight Time"
            rules={[{ required: true, message: "Please input highlight time!" }]}
          >
            <InputNumber 
              placeholder="Highlight Time" 
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="priorityTime"
            label="🔝 Priority Time"
            rules={[{ required: true, message: "Please input priority time!" }]}
          >
            <InputNumber 
              placeholder="Priority Time" 
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="maxPost"
            label="📏 Max Post"
            tooltip="Leave empty for unlimited posts"
          >
            <InputNumber 
              placeholder="Max Post (leave empty for unlimited)" 
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="label"
            label="🏷️ Label"
          >
            <Input placeholder="Package Label" />
          </Form.Item>

          <Form.Item
            name="status"
            label="🔄 Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PackageUpdateForm;