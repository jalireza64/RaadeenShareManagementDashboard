//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmployeeRequest
{
    using System;
    using System.Collections.Generic;
    
    public partial class SHAREHOLDER
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SHAREHOLDER()
        {
            this.SHR_TRANSACTION = new HashSet<SHR_TRANSACTION>();
            this.SHR_TRANSACTION1 = new HashSet<SHR_TRANSACTION>();
            this.SHR_FIN_INFO = new HashSet<SHR_FIN_INFO>();
        }
    
        public string SHRH_CODE { get; set; }
        public string SEPLC_CODE { get; set; }
        public Nullable<decimal> NATID { get; set; }
        public string TAX_LEVEL { get; set; }
        public string BANK_CODE { get; set; }
        public string BANK_BRANCH_CODE { get; set; }
        public string USER_ID { get; set; }
        public string SP_SHRH_CODE { get; set; }
        public Nullable<decimal> CITYID { get; set; }
        public string ADDRESS { get; set; }
        public string TEL_NO_1 { get; set; }
        public string CELL_PHONE { get; set; }
        public string FAX_NO { get; set; }
        public string ZIP_CODE { get; set; }
        public string TEL_NO_2 { get; set; }
        public string E_MAIL { get; set; }
        public string POST_BOX { get; set; }
        public string CERT_NO { get; set; }
        public string SURNAME1 { get; set; }
        public string NAME1 { get; set; }
        public string FATHER1 { get; set; }
        public string D1_BIRTH { get; set; }
        public Nullable<decimal> BIRTH_CITY { get; set; }
        public Nullable<decimal> CERT_CITY { get; set; }
        public string D1_ISSU_CERT { get; set; }
        public string SERIAL_CERT_NO { get; set; }
        public string NAT_CODE { get; set; }
        public string INSTITUTE { get; set; }
        public string REG_PLACE { get; set; }
        public string REG_DATE { get; set; }
        public string AGENT { get; set; }
        public string BUSS_KIND { get; set; }
        public string REG_NO { get; set; }
        public string INST_KIND { get; set; }
        public string ECO_CODE { get; set; }
        public string TBL_DATE { get; set; }
        public string SHRH_KIND { get; set; }
        public string SHRH_ACTIVITY { get; set; }
        public string SHRH_EXCH_CODE { get; set; }
        public string SHRH_FIRST_SERIAL { get; set; }
        public string NOTE { get; set; }
        public string SHRH_ACC { get; set; }
        public Nullable<System.DateTime> UPDATE_DATE { get; set; }
        public string SHRH_BBS_CODE { get; set; }
        public byte[] SHRH_SIGN { get; set; }
        public string SHRH_PWD { get; set; }
        public string acc_kind_code { get; set; }
        public string sp_class_code { get; set; }
        public string sp_class_item_code { get; set; }
        public string SEX { get; set; }
        public string SP_BANK_CODE { get; set; }
        public string BANK_ACC_NAME { get; set; }
        public string D1_BANK { get; set; }
        public byte[] DOC_PIC { get; set; }
        public byte[] PIC_SIGN { get; set; }
        public string NAT_ID { get; set; }
        public string SURNAME_ID { get; set; }
        public string NAME_ID { get; set; }
        public string FATHER_ID { get; set; }
        public string INSTITUTE_ID { get; set; }
        public string SHRH_DET { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SHR_TRANSACTION> SHR_TRANSACTION { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SHR_TRANSACTION> SHR_TRANSACTION1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SHR_FIN_INFO> SHR_FIN_INFO { get; set; }
        public virtual CITY CITY { get; set; }
    }
}