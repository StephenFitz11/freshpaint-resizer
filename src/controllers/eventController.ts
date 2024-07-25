import { Router, Request, Response, NextFunction } from "express";

const eventController = {
  trackEvents: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { events } = req.body;
      const apiEndpoint = process.env.FP_HTTP_API_ENDPOINT;
      const fpToken = process.env.FP_TOKEN;

      if (!events || !apiEndpoint || !fpToken) {
        return next({
          message: {
            err: "eventController.trackEvents: ERROR: Missing required data",
          },
          log: "Error occured in eventController.trackEvents",
        });
      }

      const requests = events.map(async (purchase: any, idx: number) => {
        // Convert the purchase timestamp to a Unix timestamp
        const unixTimeStamp = Math.floor(
          new Date(purchase.timestamp).getTime() / 1000
        );

        delete purchase.timestamp;

        return fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "Purchase",
            properties: {
              distinct_id: purchase.customer_name,
              token: fpToken,
              time: unixTimeStamp,
              ...purchase,
            },
          }),
        });
      });

      await Promise.all(requests);

      return next();
    } catch (error: any) {
      return next({
        message: {
          err: `'eventController.trackEvents: ERROR: '${error.message}`,
        },
        log: "Error occured in eventController.trackEvents",
      });
    }
  },
};

export default eventController;
