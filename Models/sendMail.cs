namespace Dashboard.Models
{
    public class sendMail
    {
        public string To { get; set; }
        public string From { get; set; }
        public string Subject { get; set; }
        public string textBody { get; set; }
        public string strdisplay { get; set; }
        public string CCMail { get; set; }
        public string applicationname { get; set; }
        public string ActionType { get; set; }
        public string Body { get; set; }
        public DataClass dataClass { get; set; }
        public string StandardDisplay { get; set; }
    }

    public class DataClass
    {
        public string RecipentName { get; set; }
        public string RefferenceId { get; set; }
        public string CreatedBy { get; set; }
        public string CustomerName { get; set; }
        public string IdentFlag { get; set; }
        public string Remark { get; set; }
    }

    public class OVIMailLog
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public DateTime ActionDate { get; set; }
    }
}
