import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';

// Step components
import Login from './Login';
import DeliveryAddressForm from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import Payment from './Payment';

const steps = ['Login', 'Delivery', 'Order Summary', 'Payment'];
const DELIVERY_STEP_INDEX = 1; // Define index for clarity
const PAYMENT_STEP_INDEX = 3; // Define index for clarity

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '0', 10);
  const [activeStep, setActiveStep] = useState(
    initialStep >= 0 && initialStep < steps.length ? initialStep : 0
  );
  const [completed, setCompleted] = useState({});
  const navigate = useNavigate();
  const [currentDeliveryAddress, setCurrentDeliveryAddress] = useState(null); // New state for address

  const handleStepClick = (step) => {
    if (completed[step] || step === activeStep + 1) {
      updateStep(step);
    } else if (step < activeStep) {
      updateStep(step);
    }
  };

  const updateStep = (step) => {
    setActiveStep(step);
    navigate(`?step=${step}`);
  };

  const handleNext = () => {
    const newCompleted = { ...completed, [activeStep]: true };
    setCompleted(newCompleted);
    
    const newActiveStep = activeStep + 1;
    if (newActiveStep <= steps.length - 1) {
      updateStep(newActiveStep);
    }
  };

  const handleBack = () => {
    updateStep(activeStep - 1);
  };

  // Modified to accept data from child components
  const handleCompleteStep = (dataFromChild) => {
    console.log(`Step ${activeStep} ('${steps[activeStep]}') completed. Data received:`, dataFromChild);
    
    const newCompleted = { ...completed, [activeStep]: true };
    setCompleted(newCompleted);

    if (activeStep === PAYMENT_STEP_INDEX) {
      // Navigation and session storage clearing is now handled by Payment.jsx
      // We just mark as complete and log here.
      if (dataFromChild && (dataFromChild.id || dataFromChild._id)) {
        const orderId = dataFromChild._id || dataFromChild.id;
        console.log(`Payment successful. Order ID: ${orderId}. Navigation handled by Payment.jsx.`);
      } else {
        console.warn('Order data or Order ID might be missing after payment completion, though navigation is handled by Payment.jsx.', dataFromChild);
      }
      // DO NOT call handleNext() here, as navigation away from checkout has occurred.
    } else if (activeStep === DELIVERY_STEP_INDEX && dataFromChild) {
      console.log("Setting current delivery address:", dataFromChild);
      setCurrentDeliveryAddress(dataFromChild);
      handleNext(); // Proceed to next step (e.g., Order Summary or Payment)
    } else {
      // For other steps (Login, Order Summary), or if no specific data handling is needed for this step
      handleNext(); // Moves to the next step in the stepper
    }
  };

  const getStepContent = (step) => {
    const commonProps = {
      onComplete: handleCompleteStep, // Pass the modified handler
      onBack: handleBack,
    };

    switch (step) {
      case 0:
        return <Login {...commonProps} />;
      case 1: // Delivery Address Form
        return <DeliveryAddressForm {...commonProps} />;
      case 2: // Order Summary
        return <OrderSummary {...commonProps} />;
      case 3: // Payment
        return <Payment {...commonProps} deliveryAddress={currentDeliveryAddress} />; // Pass address to Payment
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Paper elevation={3} className="p-6 rounded-lg">
        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label, index) => (
            <Step 
              key={label} 
              completed={completed[index]}
              onClick={() => handleStepClick(index)}
              className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition"
            >
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#14b8a6' },
                    '&.Mui-completed': { color: '#14b8a6' },
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box className="min-h-[400px]">
          {getStepContent(activeStep)}
        </Box>

        {activeStep !== steps.length - 1 && (
          <Box className="flex justify-between mt-6">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderColor: '#14b8a6',
                color: '#14b8a6',
                '&:hover': {
                  borderColor: '#0f766e',
                  color: '#0f766e',
                  backgroundColor: 'rgba(14, 184, 166, 0.04)'
                }
              }}
              className="px-6 py-2"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext} // Note: handleNext is used for the generic Next button here.
                                 // handleCompleteStep is called by child components to signify completion and pass data.
              sx={{
                backgroundColor: '#14b8a6',
                '&:hover': {
                  backgroundColor: '#0f766e'
                }
              }}
              className="px-6 py-2"
              disabled={!completed[activeStep] && activeStep !== steps.length - 1}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Checkout;