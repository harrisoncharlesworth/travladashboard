-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create metrics table
CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    bookings_today INTEGER NOT NULL DEFAULT 0,
    revenue_today DECIMAL(10,2) NOT NULL DEFAULT 0,
    occupancy_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    revpar DECIMAL(10,2) NOT NULL DEFAULT 0,
    adr DECIMAL(10,2) NOT NULL DEFAULT 0,
    walk_ins INTEGER NOT NULL DEFAULT 0,
    staff_hours_scheduled DECIMAL(5,2) NOT NULL DEFAULT 0,
    staff_hours_worked DECIMAL(5,2) NOT NULL DEFAULT 0,
    review_score DECIMAL(3,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insights table
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    severity VARCHAR(10) CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    cta_label VARCHAR(255),
    cta_href VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_metrics_property_date ON metrics(property_id, date);
CREATE INDEX idx_insights_property_created ON insights(property_id, created_at);
CREATE INDEX idx_insights_severity ON insights(severity);

-- Insert sample properties
INSERT INTO properties (name, location, emoji, photo_url) VALUES
('Surfers Paradise Resort', 'Gold Coast, QLD', '🌊', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'),
('Byron Bay Beachfront', 'Byron Bay, NSW', '🏖️', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'),
('Melbourne CBD Tower', 'Melbourne, VIC', '🌳', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80');
