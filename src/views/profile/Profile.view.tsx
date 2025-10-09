'use client';
import { Tabs, TabsProps } from 'antd';
import BasicInfo from './subViews/basicInfo/BasicInfo.component'; 
import UserManagement from './subViews/userManagement'; 

const Profile = () => { 
  const tabs: TabsProps['items'] = [
    {
      label: 'Info',
      key: '1',
      children: <BasicInfo />,
    },
    {
      label: 'User Management',
      key: '4',
      children: <UserManagement onUserRemoved={() => {}} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default Profile;
