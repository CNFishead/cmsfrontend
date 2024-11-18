"use client";
import React from "react";
import styles from "./MinistryDetails.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Select, Input, Divider, Row, Empty, Tabs } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";
import useFetchData from "@/state/useFetchData";
import UserItem from "@/components/userItem/UserItem.component";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import MemberType from "@/types/MemberType";
import { useSearchStore } from "@/state/search/search";
import { useUser } from "@/state/auth";
import slugify from "slugify";
import useApiHook from "@/state/useApi";
import Members from "./subviews/Members.component";
import MinistryInfo from "./subviews/MinistryInfo.component";
import AnimatedDiv from "@/components/animatedDiv/AnimatedDiv.UI";
import { AnimatePresence } from "framer-motion";

const MinistryDetails = () => {
  const tabs = [
    {
      key: "Ministry Info",
      title: "Info",
      content: <MinistryInfo />,
    },
    {
      key: "members",
      title: "Members",
      content: <Members />,
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" type="card">
        {tabs.map((tab) => (
          <Tabs.TabPane tab={tab.title} key={tab.key}>
            <AnimatePresence mode="wait">
              <AnimatedDiv
                transitionType="fade"
                duration={0.5}
                key={`switchableView-${tab.key}`}
                type="whileInView"
                className={styles.tabsContainer}
              >
                {tab.content}
              </AnimatedDiv>
            </AnimatePresence>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default MinistryDetails;
