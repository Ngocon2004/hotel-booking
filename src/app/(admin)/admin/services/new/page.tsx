import ServiceForm from '@/components/admin/service-form'
import { createService } from '@/server/actions/services'

export default function NewServicePage() {
  return <ServiceForm action={createService} title="Thêm dịch vụ" />
}
