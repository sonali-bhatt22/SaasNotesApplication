import { Tenant } from "../db.js";

export const upgradePlan = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { plan: "pro" },
      { new: true, runValidators: true }
    );
    
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }
    
    res.json({ 
      message: `${tenant.name} (${slug}) upgraded to Pro`,
      tenant: {
        slug: tenant.slug,
        name: tenant.name,
        plan: tenant.plan
      }
    });
  } catch (error) {
    console.error("Error upgrading tenant plan:", error);
    res.status(500).json({ error: "Failed to upgrade plan" });
  }
};

export const getTenant = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }
    
    res.json({
      slug: tenant.slug,
      name: tenant.name,
      plan: tenant.plan,
      maxNotes: tenant.maxNotes,
      createdAt: tenant.createdAt
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).json({ error: "Failed to fetch tenant" });
  }
};
