package com.autoflex.production_control;

import java.util.List;

public class PlanningResult {
    public boolean isViable;
    public String message;
    public List<ItemAnalysis> details;

    public static class ItemAnalysis {
        public String materialName;
        public double required;
        public double stock;
        public String status;

        public ItemAnalysis(String name, double req, double st, String stat) {
            this.materialName = name;
            this.required = req;
            this.stock = st;
            this.status = stat;
        }
    }
}