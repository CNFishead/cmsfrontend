"use client";
import BlockedMessage from "@/components/blockedMessage/BlockedMessage.component";
import { useUser } from "@/state/auth";
import { useLayoutStore } from "@/state/ui/layout";
import { ControlNavItem } from "@/types/navigation";
import { FEATURES, hasFeature } from "@/utils/hasFeature";
import Auth from "@/views/auth/Auth.view";
import Head from "next/head";
import { ReactNode } from "react";
import { AiFillControl } from "react-icons/ai";

import Control from "../control/Control.layout";
import Header from "../header/Header.layout";
import SideBar from "../sideBar/SideBar.layout";
import styles from "./Page.module.scss";
import Meta from "@/components/meta/Meta.component";

//make a type with children as a prop
type Props = {
  children: React.ReactNode;
  pages: Array<{ title: string; link?: string; icon?: ReactNode }>;
  largeSideBar?: boolean;
  backgroundColor?: string;
  hideControlLayout?: boolean;
  controlNav?: Array<ControlNavItem>;
  neededFeature?: any;
  enableBlockCheck?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    image?: string;
  };
};
const PageLayout = (props: Props) => {
  const sideBarOpen = useLayoutStore((state) => state.sideBarOpen);
  const controlLayoutOpen = useLayoutStore((state) => state.controlLayoutOpen);
  const toggleControlLayout = useLayoutStore((state) => state.toggleControlLayout);

  const { data: loggedInData } = useUser();
  const getPageBlockData: () => boolean | "blacklist" | "feature" | "verification" = () => {
    if (!props.enableBlockCheck) return false;
    if (loggedInData.user.isBlacklisted) {
      return "blacklist";
    }

    if (!loggedInData.user.isTruthcastingVerified) {
      return "verification";
    }

    if (props.neededFeature) {
      if (!hasFeature(loggedInData.user, props.neededFeature)) {
        return "feature";
      }
    }

    return false as boolean;
  };

  return (
    <>
      <div
        className={`${styles.container} ${props.largeSideBar ? "" : styles.small} ${
          sideBarOpen && styles.sideBarActive
        }`}
      >
        {loggedInData ? (
          <>
            <Header pages={props.pages} />
            <div className={styles.sideBar}>
              {props.pages && <SideBar page={props.pages[0]} large={props.largeSideBar} />}
            </div>
            <div
              className={`${styles.content} ${
                controlLayoutOpen && !getPageBlockData() && styles.controlContainerActive
              } ${props.controlNav && !getPageBlockData() && !props.hideControlLayout && styles.controlBarActive}`}
              style={{
                backgroundColor: props.backgroundColor,
              }}
            >
              {props.controlNav && !getPageBlockData() && !props.hideControlLayout && (
                <>
                  <div className={styles.controlContainer}>
                    <Control navigation={props.controlNav} />
                  </div>

                  <div className={styles.controlToggleBtn} onClick={() => toggleControlLayout()}>
                    <AiFillControl />
                  </div>
                </>
              )}

              <div className={styles.childrenWrapper}>
                <div className={styles.childrenContainer}>
                  {getPageBlockData() ? (
                    <BlockedMessage neededFeature={props.neededFeature} type={getPageBlockData() as any} />
                  ) : (
                    <>{props.children}</>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Auth />
        )}
      </div>
    </>
  );
};
export default PageLayout;
