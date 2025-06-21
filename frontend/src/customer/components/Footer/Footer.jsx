import  {Grid2, Typography }  from "@mui/material"
import Button from "@mui/material/Button"
import React from 'react'

const Footer = () => {
  return (
    <div className="bg-black mt-auto flex justify-center">
  <Grid2
    container
    justifyContent="space-around"
    sx={{ bgcolor: "black", color: "white", py: 3, width: "90%" }}  // Width adjust kiya for better spacing
  >
    <Grid2 item xs={12} sm={6} md={3} container direction="column" alignItems="center">
      <Typography className="pb-4" variant="h6">Company</Typography>
      <Button size="small" sx={{color:"white"}}>About</Button>
      <Button size="small" sx={{color:"white"}}>Blog</Button>
      <Button size="small" sx={{color:"white"}}>Press</Button>
      <Button size="small" sx={{color:"white"}}>Jobs</Button>
      <Button size="small" sx={{color:"white"}}>Partner</Button>
    </Grid2>

    <Grid2 item xs={12} sm={6} md={3} container direction="column" alignItems="center">
      <Typography className="pb-4" variant="h6">Solutions</Typography>
      <Button size="small" sx={{color:"white"}}>Marketing</Button>
      <Button size="small" sx={{color:"white"}}>Analytics</Button>
      <Button size="small" sx={{color:"white"}}>Commerce</Button>
      <Button size="small" sx={{color:"white"}}>Insights</Button>
      <Button size="small" sx={{color:"white"}}>Support</Button>
    </Grid2> 

    <Grid2 item xs={12} sm={6} md={3} container direction="column" alignItems="center">
      <Typography className="pb-4" variant="h6">Documentation</Typography>
      <Button size="small" sx={{color:"white"}}>Guides</Button>
      <Button size="small" sx={{color:"white"}}>API Status</Button>
    </Grid2>

    <Grid2 item xs={12} sm={6} md={3} container direction="column" alignItems="center">
      <Typography className="pb-4" variant="h6">Legal</Typography>
      <Button size="small" sx={{color:"white"}}>Claim</Button>
      <Button size="small" sx={{color:"white"}}>Privacy</Button>
      <Button size="small" sx={{color:"white"}}>Terms</Button>
    </Grid2>
  </Grid2>
</div>

  )
}

export default Footer;