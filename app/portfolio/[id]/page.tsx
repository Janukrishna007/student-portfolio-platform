import { DigitalPortfolio } from "@/components/portfolio/digital-portfolio"
import { mockStudents, mockAchievements } from "@/lib/mock-data"

interface PortfolioPageProps {
  params: {
    id: string
  }
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const student = mockStudents.find((s) => s.id === params.id) || mockStudents[0]
  const achievements = mockAchievements.filter((a) => a.studentId === student.id)

  return <DigitalPortfolio student={student} achievements={achievements} />
}
