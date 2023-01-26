/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsysteminitialpartymember.h"
#include "rpm.h"

const QString SystemInitialPartyMember::JSON_LEVEL = "level";
const QString SystemInitialPartyMember::JSON_TEAM_KIND = "teamKind";
const QString SystemInitialPartyMember::JSON_IS_HERO = "isHero";
const QString SystemInitialPartyMember::JSON_HERO_ID = "heroID";
const QString SystemInitialPartyMember::JSON_MONSTER_ID = "monsterID";
const QString SystemInitialPartyMember::JSON_VARIABLE_INSTANCE_ID = "variableInstanceID";
const int SystemInitialPartyMember::DEFAULT_LEVEL = 1;
const TeamKind SystemInitialPartyMember::DEFAULT_TEAM_KIND = TeamKind::Team;
const bool SystemInitialPartyMember::DEFAULT_IS_HERO = true;
const int SystemInitialPartyMember::DEFAULT_HERO_ID = 1;
const int SystemInitialPartyMember::DEFAULT_MONSTER_ID = 1;
const int SystemInitialPartyMember::DEFAULT_VARIABLE_INSTANCE_ID = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemInitialPartyMember::SystemInitialPartyMember(int id, QString name,
    PrimitiveValue *level, TeamKind teamKind, bool isHero, PrimitiveValue *heroID,
    PrimitiveValue *monsterID, PrimitiveValue *variableInstanceID) :
    SuperListItem(id, name),
    m_level(level),
    m_teamKind(teamKind),
    m_isHero(isHero),
    m_heroID(heroID),
    m_monsterID(monsterID),
    m_variableInstanceID(variableInstanceID)
{
    m_heroID->setModelDataBase(RPM::get()->project()->gameDatas()->heroesDatas()
        ->model());
    m_monsterID->setModelDataBase(RPM::get()->project()->gameDatas()->monstersDatas()
        ->model());
}

SystemInitialPartyMember::~SystemInitialPartyMember()
{
    delete m_level;
    delete m_heroID;
    delete m_monsterID;
    delete m_variableInstanceID;
}

PrimitiveValue * SystemInitialPartyMember::level() const
{
    return m_level;
}

TeamKind SystemInitialPartyMember::teamKind() const
{
    return m_teamKind;
}

void SystemInitialPartyMember::setTeamKind(TeamKind teamKind)
{
    m_teamKind = teamKind;
}

bool SystemInitialPartyMember::isHero() const
{
    return m_isHero;
}

void SystemInitialPartyMember::setIsHero(bool isHero)
{
    m_isHero = isHero;
}

PrimitiveValue * SystemInitialPartyMember::heroID() const
{
    return m_heroID;
}

PrimitiveValue * SystemInitialPartyMember::monsterID() const
{
    return m_monsterID;
}

PrimitiveValue * SystemInitialPartyMember::variableInstanceID() const
{
    return m_variableInstanceID;
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

QString SystemInitialPartyMember::toString() const
{
    return m_isHero ? m_heroID->toString() : m_monsterID->toString();
}

// -------------------------------------------------------

bool SystemInitialPartyMember::openDialog()
{
    SystemInitialPartyMember member;
    member.setCopy(*this);
    DialogSystemInitialPartyMember dialog(member);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(member);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemInitialPartyMember::createCopy() const
{
    SystemInitialPartyMember *super = new SystemInitialPartyMember;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemInitialPartyMember::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemInitialPartyMember *member = reinterpret_cast<const
        SystemInitialPartyMember *>(&super);
    m_level->setCopy(*member->m_level);
    m_teamKind = member->m_teamKind;
    m_isHero = member->m_isHero;
    m_heroID->setCopy(*member->m_heroID);
    m_monsterID->setCopy(*member->m_monsterID);
    m_variableInstanceID->setCopy(*member->m_variableInstanceID);
}

// -------------------------------------------------------

void SystemInitialPartyMember::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_LEVEL))
    {
        m_level->read(json[JSON_LEVEL].toObject());
    }
    if (json.contains(JSON_TEAM_KIND))
    {
        m_teamKind = static_cast<TeamKind>(json[JSON_TEAM_KIND].toInt());
    }
    if (json.contains(JSON_IS_HERO))
    {
        m_isHero = json[JSON_IS_HERO].toBool();
    }
    if (json.contains(JSON_HERO_ID))
    {
        m_heroID->read(json[JSON_HERO_ID].toObject());
    }
    if (json.contains(JSON_MONSTER_ID))
    {
        m_monsterID->read(json[JSON_MONSTER_ID].toObject());
    }
    if (json.contains(JSON_VARIABLE_INSTANCE_ID))
    {
        m_variableInstanceID->read(json[JSON_VARIABLE_INSTANCE_ID].toObject());
    }
}

// -------------------------------------------------------

void SystemInitialPartyMember::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    QJsonObject obj;
    if (!m_level->isDefaultNumberValue(DEFAULT_LEVEL))
    {
        obj = QJsonObject();
        m_level->write(obj);
        json[JSON_LEVEL] = obj;
    }
    if (m_teamKind != DEFAULT_TEAM_KIND)
    {
        json[JSON_TEAM_KIND] = static_cast<int>(m_teamKind);
    }
    if (m_isHero != DEFAULT_IS_HERO)
    {
        json[JSON_IS_HERO] = m_isHero;
    }
    if (m_isHero)
    {
        if (!m_heroID->isDefaultDataBaseValue())
        {
            obj = QJsonObject();
            m_heroID->write(obj);
            json[JSON_HERO_ID] = obj;
        }
    } else
    {
        if (!m_monsterID->isDefaultDataBaseValue())
        {
            obj = QJsonObject();
            m_monsterID->write(obj);
            json[JSON_MONSTER_ID] = obj;
        }
    }
    if (m_variableInstanceID->kind() != PrimitiveValueKind::Variable ||
        m_variableInstanceID->numberValue() != DEFAULT_VARIABLE_INSTANCE_ID)
    {
        obj = QJsonObject();
        m_variableInstanceID->write(obj);
        json[JSON_VARIABLE_INSTANCE_ID] = obj;
    }
}
