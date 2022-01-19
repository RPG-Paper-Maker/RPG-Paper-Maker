/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemgameovercommand.h"
#include "dialogsystemgameovercommand.h"

const QString SystemGameOverCommand::JSON_KIND = "k";
const QString SystemGameOverCommand::JSON_SCRIPT = "s";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemGameOverCommand::SystemGameOverCommand() :
    SystemGameOverCommand(-1, "", GameOverCommandKind::Continue)
{

}

SystemGameOverCommand::SystemGameOverCommand(int i, QString name, GameOverCommandKind k) :
    SystemTranslatable(i, name),
    m_kind(k)
{

}

SystemGameOverCommand::~SystemGameOverCommand()
{

}

GameOverCommandKind SystemGameOverCommand::kind() const
{
    return m_kind;
}

void SystemGameOverCommand::setKind(GameOverCommandKind k)
{
    m_kind = k;
}

QString SystemGameOverCommand::script() const
{
    return m_script;
}

void SystemGameOverCommand::setScript(QString s)
{
    m_script = s;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemGameOverCommand::openDialog()
{
    SystemGameOverCommand titleCommand;
    titleCommand.setCopy(*this);
    DialogSystemGameOverCommand dialog(titleCommand);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(titleCommand);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemGameOverCommand::createCopy() const
{
    SystemGameOverCommand *super = new SystemGameOverCommand;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemGameOverCommand::setCopy(const SuperListItem &super)
{
    const SystemGameOverCommand *command = reinterpret_cast<const
        SystemGameOverCommand *>(&super);
    SystemTranslatable::setCopy(*command);
    m_kind = command->m_kind;
    m_script = m_kind == GameOverCommandKind::Script ? command->m_script : "";
}

// -------------------------------------------------------

QList<QStandardItem *> SystemGameOverCommand::getModelRow() const
{
    QList<QStandardItem *> row;
    QStandardItem *item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(this->toStringName());
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(item);
    return row;
}

// -------------------------------------------------------

void SystemGameOverCommand::read(const QJsonObject &json)
{
    SystemTranslatable::read(json);
    if (json.contains(JSON_KIND))
    {
        m_kind = static_cast<GameOverCommandKind>(json[JSON_KIND].toInt());
    }
    if (json.contains(JSON_SCRIPT))
    {
        m_script = json[JSON_SCRIPT].toString();
    }
}

// -------------------------------------------------------

void SystemGameOverCommand::write(QJsonObject &json) const
{
    SystemTranslatable::write(json);
    if (m_kind != GameOverCommandKind::Continue)
    {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    if (!m_script.isEmpty())
    {
        json[JSON_SCRIPT] = m_script;
    }
}
