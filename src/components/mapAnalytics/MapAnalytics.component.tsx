import { useState } from "react";
import styles from "./MapAnalytics.module.scss";
import Image from "next/image";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { Progress, Skeleton, Table, Popover, Empty } from "antd";
import { useEffect } from "react";
import { getStateCode } from "@/utils/getStateCode";
import Error from "@/components/error/Error.component";
type Props = {
  videoId?: string;
  small?: boolean;
};

const MapAnalytics = (props: Props) => {
  const [geoUrl, setGeoUrl] = useState<string>("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const [openStates, setOpenStates] = useState<string[]>([]);
  const [center, setCenter] = useState<number[]>([-95.7129, 37.0902]);
  // if (isLoading) return <Skeleton active />;
  // if (isError) return <Error error={error} />;

  return (
    <div className={`${styles.container} ${props.small && styles.small}`}>
      <div
        className={styles.mapContainer}
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <ComposableMap>
          <ZoomableGroup center={center as any} zoom={7}>
            <Geographies geography={geoUrl}>
              {({ geographies }: any) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#c4cbce"
                    style={{
                      default: {
                        fill: "#557797",
                        stroke: "#ffffff",
                        strokeWidth: 0.3,
                        outline: "none",
                      },
                      hover: {
                        fill: "#557797",
                        stroke: "#ffffff",
                        strokeWidth: 0.3,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
            {/* {mapData?.data?.geoLocation.map((state: any) => {
              if (state._id !== "other" && state.cities.length > 0)
                return state.cities?.map((city: any) => {
                  return (
                    <Popover content={<p>{city.city}</p>} title={state._id} key={city.city + city.count}>
                      <Marker
                        coordinates={[city.long, city.lat]}
                        key={city._id}
                        onClick={() => {
                          setOpenStates([...openStates, state._id]);
                          //scroll to the state
                          document.getElementById(state._id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "start",
                          });
                        }}
                      >
                        <circle
                          r={Math.min(Math.max(city.count / 10, 1), 5)}
                          fill="#173c52"
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Marker>
                    </Popover>
                  );
                });
            })} */}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {/* {mapData?.data?.geoLocation?.length === 0 && (
        <Empty description={<span>There are no views for this video yet.</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )} */}
      <div className={styles.mapInfo} id="states">
        {/* {mapData?.data?.geoLocation.map((location: any) => (
          <>
            <div
              className={`${styles.infoContainer}`}
              id={location._id}
              onClick={() => {
                if (openStates.includes(location._id)) {
                  setOpenStates(openStates.filter((state) => state !== location._id));
                } else {
                  setCenter([location.cities[0].long, location.cities[0].lat]);

                  setOpenStates([...openStates, location._id]);
                }
              }}
            >
              <div className={styles.nameContainer}>
                <Image
                  className={styles.flag}
                  alt="flag"
                  src={
                    location._id === "other" || location._id === ""
                      ? "https://flagcdn.com/us.svg"
                      : `https://flagcdn.com/us-${getStateCode(location._id)}.svg`
                  }
                  width={24}
                  height={24}
                />
                <div className={styles.name}>
                  <h1 className={styles.state}>
                    {location._id === "other" || location._id === "" ? "Other" : location._id}
                  </h1>
                  <Progress
                    type="line"
                    percent={
                      //make a percentage of the total views
                      (
                        (location.count / mapData?.data?.geoLocation.reduce((a: any, b: any) => a + b.count, 0)) *
                        100
                      ).toFixed(2) as any
                    }
                    strokeColor="#557797"
                  />
                </div>
              </div>

              <p className={styles.info}>{location.count}</p>
            </div>
            <div className={`${styles.citiesContainer} ${openStates.includes(location._id) ? styles.active : ""}`}>
              <Table
                dataSource={location.cities}
                pagination={false}
                columns={[
                  {
                    title: "City",
                    dataIndex: "city",
                    key: "city",
                  },
                  {
                    title: "Views",
                    dataIndex: "count",
                    key: "count",
                  },
                ]}
              />
              {location.cities.map((city: any) => (
                <div className={styles.city}>
                  <h1 className={styles.cityName}>{city.city || "Other"}</h1>
                  <p className={styles.cityInfo}>{city.count}</p>
                </div>
              ))}
            </div>
          </>
        ))} */}
      </div>
    </div>
  );
};

export default MapAnalytics;
