-- TuttAcasa - Schema completo

-- Households
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Casa mia',
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(4), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Household members
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  color TEXT NOT NULL DEFAULT '#A855F7',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit TEXT DEFAULT 'pz',
  barcode TEXT,
  expiry_date DATE,
  notes TEXT,
  image_url TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_expiry ON products(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_products_household ON products(household_id);

-- Shopping list
CREATE TABLE shopping_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'pz',
  category_id UUID REFERENCES categories(id),
  is_bought BOOLEAN NOT NULL DEFAULT false,
  is_auto BOOLEAN NOT NULL DEFAULT false,
  source_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  added_by UUID REFERENCES auth.users(id),
  bought_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  bought_at TIMESTAMPTZ
);

CREATE INDEX idx_shopping_household ON shopping_list(household_id);

-- Bills
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10,2),
  due_date DATE NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  paid_by UUID REFERENCES auth.users(id),
  recurring TEXT NOT NULL DEFAULT 'none' CHECK (recurring IN ('none', 'monthly', 'bimonthly', 'quarterly', 'yearly')),
  notes TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bills_household ON bills(household_id);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- Push subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  device_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification log
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('product_expiry', 'bill_expiry')),
  reference_id UUID NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, type, reference_id, (sent_at::date))
);

-- Purchase history
CREATE TABLE purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  quantity INT NOT NULL DEFAULT 1,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  purchased_by UUID REFERENCES auth.users(id)
);

-- ====== RLS ======
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION get_user_household_id()
RETURNS UUID AS $$
  SELECT household_id FROM household_members WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS policies for each table
CREATE POLICY "hh_select" ON households FOR SELECT USING (id = get_user_household_id());
CREATE POLICY "hm_select" ON household_members FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "hm_insert" ON household_members FOR INSERT WITH CHECK (true);

CREATE POLICY "cat_select" ON categories FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "cat_insert" ON categories FOR INSERT WITH CHECK (household_id = get_user_household_id());
CREATE POLICY "cat_update" ON categories FOR UPDATE USING (household_id = get_user_household_id());
CREATE POLICY "cat_delete" ON categories FOR DELETE USING (household_id = get_user_household_id());

CREATE POLICY "prod_select" ON products FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "prod_insert" ON products FOR INSERT WITH CHECK (household_id = get_user_household_id());
CREATE POLICY "prod_update" ON products FOR UPDATE USING (household_id = get_user_household_id());
CREATE POLICY "prod_delete" ON products FOR DELETE USING (household_id = get_user_household_id());

CREATE POLICY "shop_select" ON shopping_list FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "shop_insert" ON shopping_list FOR INSERT WITH CHECK (household_id = get_user_household_id());
CREATE POLICY "shop_update" ON shopping_list FOR UPDATE USING (household_id = get_user_household_id());
CREATE POLICY "shop_delete" ON shopping_list FOR DELETE USING (household_id = get_user_household_id());

CREATE POLICY "bill_select" ON bills FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "bill_insert" ON bills FOR INSERT WITH CHECK (household_id = get_user_household_id());
CREATE POLICY "bill_update" ON bills FOR UPDATE USING (household_id = get_user_household_id());
CREATE POLICY "bill_delete" ON bills FOR DELETE USING (household_id = get_user_household_id());

CREATE POLICY "push_select" ON push_subscriptions FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "push_insert" ON push_subscriptions FOR INSERT WITH CHECK (household_id = get_user_household_id());
CREATE POLICY "push_delete" ON push_subscriptions FOR DELETE USING (household_id = get_user_household_id());

CREATE POLICY "notif_select" ON notification_log FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "notif_insert" ON notification_log FOR INSERT WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "hist_select" ON purchase_history FOR SELECT USING (household_id = get_user_household_id());
CREATE POLICY "hist_insert" ON purchase_history FOR INSERT WITH CHECK (household_id = get_user_household_id());

-- ====== Realtime ======
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_list;
ALTER PUBLICATION supabase_realtime ADD TABLE bills;

-- ====== Triggers ======
CREATE OR REPLACE FUNCTION auto_add_to_shopping_list()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity = 0 AND OLD.quantity > 0 THEN
    INSERT INTO shopping_list (household_id, name, quantity, unit, category_id, is_auto, source_product_id, added_by)
    VALUES (NEW.household_id, NEW.name, 1, NEW.unit, NEW.category_id, true, NEW.id, NEW.added_by)
    ON CONFLICT DO NOTHING;

    INSERT INTO purchase_history (household_id, product_name, category_id, quantity, purchased_by)
    VALUES (NEW.household_id, NEW.name, NEW.category_id, OLD.quantity, NEW.added_by);

    DELETE FROM products WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_shopping_list
  AFTER UPDATE OF quantity ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_to_shopping_list();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bills_updated_at
  BEFORE UPDATE ON bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====== Functions ======
CREATE OR REPLACE FUNCTION create_household_with_defaults(household_name TEXT, owner_id UUID)
RETURNS UUID AS $$
DECLARE
  new_household_id UUID;
BEGIN
  INSERT INTO households (name, created_by) VALUES (household_name, owner_id)
  RETURNING id INTO new_household_id;

  INSERT INTO household_members (household_id, user_id, role) VALUES (new_household_id, owner_id, 'admin');

  INSERT INTO categories (household_id, name, icon, color, sort_order) VALUES
    (new_household_id, 'Dispensa', '🏪', '#A855F7', 0),
    (new_household_id, 'Freschi', '🥬', '#EC4899', 1),
    (new_household_id, 'Surgelati', '❄️', '#8B5CF6', 2),
    (new_household_id, 'Consumabili', '🧴', '#D946EF', 3);

  RETURN new_household_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION join_household(code TEXT, joining_user_id UUID)
RETURNS UUID AS $$
DECLARE
  target_household_id UUID;
BEGIN
  SELECT id INTO target_household_id FROM households WHERE invite_code = code;
  IF target_household_id IS NULL THEN
    RAISE EXCEPTION 'Codice invito non valido';
  END IF;

  DELETE FROM household_members WHERE user_id = joining_user_id;
  INSERT INTO household_members (household_id, user_id, role) VALUES (target_household_id, joining_user_id, 'member');

  RETURN target_household_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
