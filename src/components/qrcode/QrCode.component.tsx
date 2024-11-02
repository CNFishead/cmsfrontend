import React from "react";
import styles from "./QrCode.module.scss";
import { useQRCode } from "next-qrcode";

interface QrCodeProps {
  url: string;
  type: string;
  colors: {
    dark: string;
    light: string;
  };
  options: {
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    margin: number;
    scale: number;
    width: number;
  };
  // a spreadable object of options that can be passed to the QRCode component
  qrOptions: object;
  logo?: string;
}

const QrCode = ({ url, type, colors, options, qrOptions }: QrCodeProps) => {
  const { SVG, Canvas, Image } = useQRCode();

  let Component =
    {
      svg: SVG,
      canvas: Canvas,
      image: Image,
    }[type] ?? SVG;

  return (
    <Component
      text={url}
      options={{
        ...options,
        color: colors,
        ...qrOptions,
      }}
    />
  );
};

// defaults for props
QrCode.defaultProps = {
  url: "https://check.shepherdscms.org",
  type: "svg",
  colors: {
    dark: "#010599FF",
    light: "#FFBF60FF",
  },
  options: {
    errorCorrectionLevel: "M",
    margin: 1.5,
    scale: 3,
    width: 300,
  },
  qrOptions: {},
};

export default QrCode;
