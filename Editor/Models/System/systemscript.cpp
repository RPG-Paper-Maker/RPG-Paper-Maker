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
    m_currentCode("")
{

}

SystemScript::~SystemScript()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemScript::getPath() const
{
    return Common::pathCombine(Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_SYSTEM_DIR), p_name);
}

// -------------------------------------------------------

QString SystemScript::getCode() const
{
    return m_changed ? m_currentCode : Common::read(this->getPath());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemScript::toString() const
{
    return SuperListItem::toString() + (m_changed ? " *" : "");
}

// -------------------------------------------------------

void SystemScript::read(const QJsonObject &json)
{
    SuperListItem::read(json);
}

// -------------------------------------------------------

void SystemScript::write(QJsonObject &json) const
{
    SuperListItem::write(json);
}
