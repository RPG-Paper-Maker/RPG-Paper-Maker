/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemscript.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemScript::SystemScript() :
    SuperListItem()
{

}

SystemScript::SystemScript(int i, QString name) :
    SuperListItem(i, name, false, false),
    m_changed(false),
    m_currentCode(""),
    m_editable(false)
{

}

SystemScript::~SystemScript()
{

}

bool SystemScript::changed() const
{
    return m_changed;
}

QString SystemScript::currentCode() const
{
    return m_currentCode;
}

bool SystemScript::editable() const
{
    return m_editable;
}

void SystemScript::setChanged(bool changed)
{
    m_changed = changed;
}

void SystemScript::setCurrentCode(QString currentCode)
{
    m_currentCode = currentCode;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemScript::getCode()
{
    if (!m_changed && m_editable)
    {
        m_currentCode = Common::read(this->getPath());
    }
    return m_currentCode;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemScript::checkChanged() const
{
    return m_changed;
}

// -------------------------------------------------------

QString SystemScript::getPath() const
{
    return Common::pathCombine(Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_SYSTEM_DIR), p_name);
}

// -------------------------------------------------------

QString SystemScript::toStringName() const
{
    return SuperListItem::toStringName() + (this->checkChanged() ? " *" : "");
}

// -------------------------------------------------------

void SystemScript::read(const QJsonObject &json)
{
    p_name = json[JSON_NAME].toString();
}

// -------------------------------------------------------

void SystemScript::write(QJsonObject &json) const
{
    json[JSON_NAME] = this->name();
}
