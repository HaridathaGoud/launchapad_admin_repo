export const AuditLogs = async (projectOwnerId,feature,action,info) => {
    let obj={
        projectOwnerId: projectOwnerId,
        feature: feature,
        action: action,
        info: JSON.stringify(info),
        createdDate: new Date()
        }
      let response=await postAudit(`Projects/SaveAdminAuditLogs`,obj)
 }