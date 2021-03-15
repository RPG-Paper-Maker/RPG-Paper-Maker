/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmainmenucommand.h"
#include "dialogsystemmainmenucommand.h"
#include "rpm.h"

const QString SystemMainMenuCommand::JSON_KIND = "kind";
const QString SystemMainMenuCommand::JSON_SCRIPT = "script";
const MainMenuCommandKind SystemMainMenuCommand::DEFAULT_KIND = MainMenuCommandKind::Inventory;
const QString SystemMainMenuCommand::DEFAULT_SCRIPT = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMainMenuCommand::SystemMainMenuCommand():
    SystemMainMenuCommand(1, "")
{

}

SystemMainMenuCommand::SystemMainMenuCommand(int id, QString name,
    MainMenuCommandKind kind, QString script):
    SystemTranslatable(id, name),
    m_kind(kind),
    m_script(script)
{

}

SystemMainMenuCommand::~SystemMainMenuCommand()
{

}

MainMenuCommandKind SystemMainMenuCommand::kind() const
{
    return m_kind;
}

void SystemMainMenuCommand::setKind(MainMenuCommandKind kind)
{
    m_kind = kind;
}

QString SystemMainMenuCommand::script() const
{
    return m_script;
}

void SystemMainMenuCommand::setScript(QString script)
{
    m_script = script;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemMainMenuCommand::openDialog()
{
    SystemMainMenuCommand mainMenuCommand;
    mainMenuCommand.setCopy(*this);
    DialogSystemMainMenuCommand dialog(mainMenuCommand);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(mainMenuCommand);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemMainMenuCommand::createCopy() const
{
    SystemMainMenuCommand* super = new SystemMainMenuCommand;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMainMenuCommand::setCopy(const SuperListItem &super)
{
    const SystemMainMenuCommand *mainMenuCommand;
    SystemTranslatable::setCopy(super);
    mainMenuCommand = reinterpret_cast<const SystemMainMenuCommand *>(&super);
    m_kind = mainMenuCommand->m_kind;
    m_script = mainMenuCommand->m_script;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMainMenuCommand::read(const QJsonObject &json)
{
    SystemTranslatable::read(json);
    if (json.contains(JSON_KIND))
    {
        m_kind = static_cast<MainMenuCommandKind>(json[JSON_KIND].toInt());
    }
    if (json.contains(JSON_SCRIPT))
    {
        m_script = json[JSON_SCRIPT].toString();
    }
}

// -------------------------------------------------------

void SystemMainMenuCommand::write(QJsonObject &json) const
{
    SystemTranslatable::write(json);
    QJsonObject obj;
    if (m_kind != DEFAULT_KIND)
    {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    if (m_kind == MainMenuCommandKind::Script && m_script != DEFAULT_SCRIPT)
    {
        json[JSON_SCRIPT] = m_script;
    }
}
