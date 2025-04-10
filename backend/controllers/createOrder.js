exports.createOrder = async (req, res) => {
    try {
      console.log("Received order request:", req.body);
  
      const { customerId, restaurantId, items, address } = req.body;
  
      // Validate required fields
      if (!customerId || !restaurantId || !items || !address) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Convert restaurantId to ObjectId if it's a string
      const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
  
      // Create the order
      const order = await Order.create({
        customerId,
        restaurantId: restaurantObjectId,
        items,
        address,
        status: "Pending",
      });
  
      // Create a notification for the restaurant
      await Notification.create({
        recipientType: "restaurant",
        recipientId: restaurantObjectId,
        message: `New order received from customer`,
      });
  
      res.status(201).json(order);
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({ message: error.message });
    }
  };
  