export interface Session {
    account_id: string;
    session_id: string;
    created_at: Date;
    expires_at: Date;
    user_agent: string;
}