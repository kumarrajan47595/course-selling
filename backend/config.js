import dotenv from "dotenv";

dotenv.config();

const JWT_USER_PASSWORD=process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY="sk_test_51PhBQ4GcNCZHUMV5iAwlRnzMlxgIiat2zG4Tzk10tmCtXi3DpC3t7Y0A915LErDvBL8SLEwoVjFU9QbX4eQV6rhQ00oieWX5Q3"

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
}