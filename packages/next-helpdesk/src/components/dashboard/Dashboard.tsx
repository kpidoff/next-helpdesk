import { Box, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import { BugReport, CheckCircle, Schedule, Warning } from "@mui/icons-material";

import React from "react";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  inProgressTickets: number;
}

interface DashboardProps {
  stats: DashboardStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Tickets",
      value: stats.totalTickets,
      icon: <BugReport color="primary" />,
      color: "#1976d2",
    },
    {
      title: "Tickets Ouverts",
      value: stats.openTickets,
      icon: <Warning color="warning" />,
      color: "#ed6c02",
    },
    {
      title: "En Cours",
      value: stats.inProgressTickets,
      icon: <Schedule color="info" />,
      color: "#0288d1",
    },
    {
      title: "Résolus",
      value: stats.resolvedTickets,
      icon: <CheckCircle color="success" />,
      color: "#2e7d32",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: 40 }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
