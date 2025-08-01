"""create accounts tables

Revision ID: 488868a45f1c
Revises: 
Create Date: 2025-06-12 22:46:59.831466

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '488868a45f1c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('job_descriptions',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('company', sa.String(), nullable=False),
    sa.Column('summary', sa.String(), nullable=False),
    sa.Column('responsibility_duties', sa.String(), nullable=False),
    sa.Column('qualification_skills', sa.JSON(), nullable=False),
    sa.Column('work_environment', sa.String(), nullable=False),
    sa.Column('salary_benefits', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('emailVerified', sa.DateTime(), nullable=True),
    sa.Column('isVerified', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('accounts',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('provider', sa.String(), nullable=False),
    sa.Column('providerAccountId', sa.String(), nullable=False),
    sa.Column('type', sa.String(), nullable=False),
    sa.Column('refresh_token', sa.String(), nullable=True),
    sa.Column('access_token', sa.String(), nullable=True),
    sa.Column('expires_at', sa.Integer(), nullable=True),
    sa.Column('token_type', sa.String(), nullable=True),
    sa.Column('scope', sa.String(), nullable=True),
    sa.Column('id_token', sa.String(), nullable=True),
    sa.Column('session_state', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('legal_authorization',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('eu_work_authorization', sa.String(), nullable=True),
    sa.Column('us_work_authorization', sa.String(), nullable=True),
    sa.Column('requires_us_visa', sa.String(), nullable=True),
    sa.Column('legally_allowed_to_work_in_us', sa.String(), nullable=True),
    sa.Column('requires_us_sponsorship', sa.String(), nullable=True),
    sa.Column('requires_eu_visa', sa.String(), nullable=True),
    sa.Column('legally_allowed_to_work_in_eu', sa.String(), nullable=True),
    sa.Column('requires_eu_sponsorship', sa.String(), nullable=True),
    sa.Column('canada_work_authorization', sa.String(), nullable=True),
    sa.Column('requires_canada_visa', sa.String(), nullable=True),
    sa.Column('legally_allowed_to_work_in_canada', sa.String(), nullable=True),
    sa.Column('requires_canada_sponsorship', sa.String(), nullable=True),
    sa.Column('uk_work_authorization', sa.String(), nullable=True),
    sa.Column('requires_uk_visa', sa.String(), nullable=True),
    sa.Column('legally_allowed_to_work_in_uk', sa.String(), nullable=True),
    sa.Column('requires_uk_sponsorship', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('self_identification',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('gender', sa.String(), nullable=True),
    sa.Column('pronouns', sa.String(), nullable=True),
    sa.Column('veteran', sa.String(), nullable=True),
    sa.Column('disability', sa.String(), nullable=True),
    sa.Column('ethnicity', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sessions',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('sessionToken', sa.String(), nullable=False),
    sa.Column('expires', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('work_preferences',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('notice_period', sa.String(), nullable=True),
    sa.Column('salary_range_usd', sa.String(), nullable=True),
    sa.Column('remote_work', sa.String(), nullable=True),
    sa.Column('in_person_work', sa.String(), nullable=True),
    sa.Column('open_to_relocation', sa.String(), nullable=True),
    sa.Column('willing_to_complete_assessments', sa.String(), nullable=True),
    sa.Column('willing_to_undergo_drug_tests', sa.String(), nullable=True),
    sa.Column('willing_to_undergo_background_checks', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('applications',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('userId', sa.UUID(), nullable=True),
    sa.Column('resume_path', sa.String(), nullable=False),
    sa.Column('cover_letter_path', sa.String(), nullable=True),
    sa.Column('self_identification_id', sa.UUID(), nullable=True),
    sa.Column('legal_authorization_id', sa.UUID(), nullable=True),
    sa.Column('work_preferences_id', sa.UUID(), nullable=True),
    sa.Column('status', sa.Enum('APPLIED', 'INTRO', 'STEP2', 'STEP3', 'STEP4', 'STEP5', 'STEP6', 'FINAL', 'ONBOARDING', 'REJECTED', name='statusenum'), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['legal_authorization_id'], ['legal_authorization.id'], ),
    sa.ForeignKeyConstraint(['self_identification_id'], ['self_identification.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.ForeignKeyConstraint(['work_preferences_id'], ['work_preferences.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('applications')
    op.drop_table('work_preferences')
    op.drop_table('sessions')
    op.drop_table('self_identification')
    op.drop_table('legal_authorization')
    op.drop_table('accounts')
    op.drop_table('users')
    op.drop_table('job_descriptions')
    # ### end Alembic commands ###
