import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface CookieModalProps {
  showCookieModal: boolean;
  setShowCookieModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CookieModal: React.FC<CookieModalProps> = ({
  showCookieModal,
  setShowCookieModal,
}) => {
  const [, setAllowCookies] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้ยอมรับคุกกี้แล้วหรือไม่
    const hasAcceptedCookies = document.cookie.includes("cookieConsent=true");
    setAllowCookies(hasAcceptedCookies);
  }, []);

  const handleCookieConsent = () => {
    setAllowCookies(true);
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    setShowCookieModal(false);
  };

  return (
    <Dialog
      open={showCookieModal}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: "500px",
          width: "100%",
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
        <Typography variant="h6" component="div">
          We Value Your Privacy
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This website uses cookies to improve your experience. By continuing to
          use this website, you agree to our cookie policy.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          We may also collect additional information such as your email, name,
          and location. This data will be used to enhance our services and may
          be utilized to train AI models for predictive analysis in the future.
          Your privacy is important to us, and we ensure that your data will be
          handled securely and in compliance with relevant regulations.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleCookieConsent}
          variant="contained"
          sx={{
            textTransform: "none",
            px: 4,
            backgroundColor: "#bd0012",
            "&:hover": {
              backgroundColor: "#a3000f", // A slightly darker shade for the hover effect
            },
          }}
        >
          Accept and Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookieModal;
