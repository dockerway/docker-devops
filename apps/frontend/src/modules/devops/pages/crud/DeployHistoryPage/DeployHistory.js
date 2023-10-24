import { AuditProvider } from '@dracul/audit-frontend'
import { Dayjs } from "@dracul/dayjs-frontend"

const allAudits = await AuditProvider.fetchAudit()
const threeMonthsAgo = Dayjs().subtract(3, 'month')

const deploysFromTheLastThreeMonths = allAudits
.filter(audit => audit.action === 'Deploy docker service')
.filter(audit => Dayjs(audit.createdAt).isAfter(threeMonthsAgo))
.map(audit => audit)


class DeployHistory{
    deploys = deploysFromTheLastThreeMonths
}

const deployHistory = new DeployHistory()
export default deployHistory
