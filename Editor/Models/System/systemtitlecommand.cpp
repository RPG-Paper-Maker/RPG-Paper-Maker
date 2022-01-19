/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtitlecommand.h"
#include "dialogsystemtitlecommand.h"

const QString SystemTitleCommand::JSON_KIND = "k";
const QString SystemTitleCommand::JSON_SCRIPT = "s";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTitleCommand::SystemTitleCommand() :
    SystemTitleCommand(-1, "", TitleCommandKind::NewGame)
{

}

SystemTitleCommand::SystemTitleCommand(int i, QString name, TitleCommandKind k) :
    SystemTranslatable(i, name),
    m_kind(k)
{

}

SystemTitleCommand::~SystemTitleCommand() {

}

TitleCommandKind SystemTitleCommand::kind() const {
    return m_kind;
}

void SystemTitleCommand::setKind(TitleCommandKind k) {
    m_kind = k;
}

QString SystemTitleCommand::script() const {
    return m_script;
}

void SystemTitleCommand::setScript(QString s) {
    m_script = s;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemTitleCommand::openDialog() {
    SystemTitleCommand titleCommand;
    titleCommand.setCopy(*this);
    DialogSystemTitleCommand dialog(titleCommand);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(titleCommand);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemTitleCommand::createCopy() const {
    SystemTitleCommand *super = new SystemTitleCommand;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTitleCommand::setCopy(const SuperListItem &super) {
    const SystemTitleCommand *titleCommand;

    titleCommand = reinterpret_cast<const SystemTitleCommand *>(&super);
    SystemTranslatable::setCopy(*titleCommand);

    m_kind = titleCommand->m_kind;
    m_script = m_kind == TitleCommandKind::Script ? titleCommand->m_script : "";
}

// -------------------------------------------------------

QList<QStandardItem *> SystemTitleCommand::getModelRow() const{
    QList<QStandardItem *> row;
    QStandardItem *item;

    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(this->toStringName());
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(item);

    return row;
}

// -------------------------------------------------------

void SystemTitleCommand::read(const QJsonObject &json) {
    SystemTranslatable::read(json);

    if (json.contains(JSON_KIND)) {
        m_kind = static_cast<TitleCommandKind>(json[JSON_KIND].toInt());
    }
    if (json.contains(JSON_SCRIPT)) {
        m_script = json[JSON_SCRIPT].toString();
    }
}

// -------------------------------------------------------

void SystemTitleCommand::write(QJsonObject &json) const {
    SystemTranslatable::write(json);

    if (m_kind != TitleCommandKind::NewGame) {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    if (!m_script.isEmpty()) {
        json[JSON_SCRIPT] = m_script;
    }
}
