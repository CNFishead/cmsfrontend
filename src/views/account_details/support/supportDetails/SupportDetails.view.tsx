"use client";
import React from "react";
import styles from "./SupportDetails.module.scss";
import { useParams } from "next/navigation";
import useApiHook from "@/state/useApi";
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import { Button, Divider, Form, Tag } from "antd";
import { useUser } from "@/state/auth";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import parse from "html-react-parser";
import { timeDifference } from "@/utils/timeDifference";
import InfiniteScrollContainer from "@/components/infiniteScrollContainer/InfiniteScrollContainer.component";

const SupportDetails = () => {
  const [form] = Form.useForm();
  // pull the id from the url
  const { id } = useParams();
  const { data: loggedInData } = useUser();

  const { data, isLoading, isError, error } = useApiHook({
    url: `/support/ticket/${id}`,
    key: "ticket",
    enabled: !!id,
    method: "GET",
  }) as any;

  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useApiHook({
    url: `/support/ticket/${id}/message`,
    key: "messages",
    filter: `ticket;${id}`,
    enabled: !!id,
    method: "GET",
  }) as any;

  const { mutate: sendMessage } = useApiHook({
    url: `/support/ticket/${id}/message`,
    key: "message",
    method: "POST",
    queriesToInvalidate: ["messages"],
  }) as any;

  const handleMessage = () => {
    sendMessage({
      formData: form.getFieldsValue(),
    });
    // clear the form after sending the message
    form.resetFields();

    // navigate to the bottom of the chat window
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error error={error.message} />;
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {/* here the user will see the details of the support ticket */}
        <Divider orientation="left">
          Support Request <span className={styles.transactionId}>{id}</span>
          <Divider type="vertical" />
          <span className={styles.status}>
            {{
              Open: (
                <>
                  is <Tag color="red">Open</Tag>
                </>
              ),
              New: (
                <>
                  is <Tag color="gold">New</Tag>
                </>
              ),
              Solved: (
                <>
                  has been <Tag color="grey">Solved</Tag>
                </>
              ),
              Pending: (
                <>
                  is await response from user <Tag color="blue">Pending</Tag>
                </>
              ),
            }[data?.payload?.data?.status] ?? <Tag color="blue">{data?.payload?.data?.status}</Tag>}
          </span>
        </Divider>
      </div>
      <div className={styles.chatWindow}>
        <InfiniteScrollContainer
          dataKey="messages"
          hook={useApiHook}
          render={(message: any, i: number) => (
            <div
              key={message._id}
              className={`${styles.chat} ${
                // if the message is from the user, align it to the right
                message.user.toString() === loggedInData?.user._id.toString() ? styles.rightChat : null
              }`}
            >
              <div
                className={`${styles.chatBubble} ${
                  // if the message is from the user, align it to the right
                  message.user.toString() === loggedInData?.user._id.toString()
                    ? styles.chatBubbleRight
                    : styles.leftBubble
                }`}
              >
                <div className={styles.message}>
                  <div className={`${styles.sender}`}>{message?.sender?.fullName}</div>
                  <div className={styles.chatText}>{parse(`${parse(message.message)}`)}</div>
                </div>
              </div>
              {/* timestamp */}
              <div
                className={`${styles.chatTime} ${
                  // if the message is from the user, align it to the right
                  message.user.toString() === loggedInData?.user._id.toString()
                    ? styles.chatTimeRight
                    : styles.chatTimeLeft
                }`}
              >
                {timeDifference(new Date().getTime(), new Date(message.createdAt).getTime())}
              </div>
            </div>
          )}
        >
          {/* here the user will see the conversation between them and the support team */}
          {messagesLoading ? (
            <Loader />
          ) : messagesError ? (
            <Error error={messagesError.message} />
          ) : (
            messages?.payload?.data?.map((message: any) => (
              <div
                key={message._id}
                className={`${styles.chat} ${
                  // if the message is from the user, align it to the right
                  message.user.toString() === loggedInData?.user._id.toString() ? styles.rightChat : null
                }`}
              >
                <div
                  className={`${styles.chatBubble} ${
                    // if the message is from the user, align it to the right
                    message.user.toString() === loggedInData?.user._id.toString()
                      ? styles.chatBubbleRight
                      : styles.leftBubble
                  }`}
                >
                  <div className={styles.message}>
                    <div className={`${styles.sender}`}>{message?.sender?.fullName}</div>
                    <div className={styles.chatText}>{parse(`${parse(message.message)}`)}</div>
                  </div>
                </div>
                {/* timestamp */}
                <div
                  className={`${styles.chatTime} ${
                    // if the message is from the user, align it to the right
                    message.user.toString() === loggedInData?.user._id.toString()
                      ? styles.chatTimeRight
                      : styles.chatTimeLeft
                  }`}
                >
                  {timeDifference(new Date().getTime(), new Date(message.createdAt).getTime())}
                </div>
              </div>
            ))
          )}
        </InfiniteScrollContainer>
      </div>
      <div className={styles.responseContainer}>
        {/* here the user will use a WYSIWYG editor to add to the conversation */}
        <div className={styles.editor}>
          <Form layout="vertical" form={form}>
            <Form.Item name="message">
              <TinyEditor handleChange={(value: string) => form.setFieldsValue({ message: value })} initialContent="" />
            </Form.Item>
            <Button onClick={handleMessage}>Send</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SupportDetails;
