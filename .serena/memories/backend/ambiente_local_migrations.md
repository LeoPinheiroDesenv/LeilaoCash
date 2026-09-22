# Drift de migrations no banco local (reconciliado em 2026-09-21)

O banco MySQL local (`vibeget_db`) tinha 15 migrations marcadas como "Pending" em `migrate:status`, embora o container já estivesse rodando há semanas com dados reais (19 users, 21 products, etc.) — sinal de que o banco veio de um dump/import direto em algum momento, sem que as migrations tivessem sido de fato aplicadas via Laravel.

Dessas 15, **5 já tinham seu efeito aplicado no schema** (schema já tinha as colunas/tabelas, mas a tabela `migrations` não tinha o registro): `2025_03_13_000001_add_translations_to_categories_table`, `2026_01_08_000001_create_password_reset_tokens_table`, `2026_01_08_000003_create_brands_table`, `2026_01_08_000004_create_product_models_table`, `2026_01_08_000005_add_brand_and_model_ids_to_products_table`. Foram marcadas como "ran" via `DB::table('migrations')->insert(...)` (batch 3) sem reexecutar, para não colidir com colunas/tabelas já existentes.

As outras 10 realmente não tinham sido aplicadas (incluindo `2026_07_06_000001_add_viber_levels_and_getcoin_settings`, que adiciona a coluna `viber_level` — sem ela, `AuthController::register` quebrava com `SQLSTATE[42S22]: Column not found`) e foram rodadas normalmente com `php artisan migrate --force`.

**Why:** descoberto ao tentar registrar um usuário de teste via API, que falhou por falta da coluna `viber_level`.

**How to apply:** o ambiente local já está com `migrate:status` limpo (zero pendentes) desde 2026-09-21, com todos os dados originais preservados (contagens conferidas antes/depois). Se voltar a aparecer "Pending" em `migrate:status`, checar primeiro se o efeito já existe no schema (`Schema::hasColumn`/`hasTable` via tinker) antes de rodar `migrate` direto — algumas migrations do projeto não são idempotentes (sem guard `if (!Schema::hasColumn(...))`) e falham com "already exists"/"Duplicate column" se você tentar rodá-las por cima de um schema que já as tem.
