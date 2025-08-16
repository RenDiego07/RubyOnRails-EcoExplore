class SeedEcosystems < ActiveRecord::Migration[8.0]
  ECOSYSTEMS = [
    { name: "Bosque tropical húmedo", description: "Selva densa y lluviosa, rica en biodiversidad, con árboles altos y clima cálido." },
    { name: "Bosque seco tropical", description: "Vegetación adaptada a largas sequías, árboles caducifolios y clima cálido." },
    { name: "Bosque andino", description: "Bosques de montaña con gran diversidad de flora y fauna, clima fresco y húmedo." },
    { name: "Páramo", description: "Ecosistema frío de alta montaña, con pastizales y plantas adaptadas a bajas temperaturas." },
    { name: "Matorral árido o desierto", description: "Zonas secas con escasa vegetación, cactus y suelos arenosos o rocosos." },
    { name: "Río", description: "Cuerpos de agua dulce que fluyen hacia el mar o lagos, vitales para comunidades y fauna." },
    { name: "Lago o laguna", description: "Acumulaciones naturales de agua dulce rodeadas de diversa vegetación." },
    { name: "Humedal", description: "Áreas inundadas temporal o permanentemente, importantes para aves y filtración de agua." },
    { name: "Playa arenosa", description: "Zonas costeras con arena fina, hábitat de aves marinas y especies playeras." },
    { name: "Manglar", description: "Bosque costero con árboles tolerantes a salinidad, refugio de peces y crustáceos." }
  ].freeze

  # Modelo minimizado y acotado al contexto de la migración para evitar depender del modelo de la app
  class EcosystemRecord < ActiveRecord::Base
    self.table_name = "ecosystems"
  end

  def up
    ECOSYSTEMS.each do |attrs|
      record = EcosystemRecord.find_or_initialize_by(name: attrs[:name])
      record.description = attrs[:description]
      record.save!(validate: false)
    end
  end

  def down
    names = ECOSYSTEMS.map { |e| e[:name] }
    EcosystemRecord.where(name: names).delete_all
  end
end
