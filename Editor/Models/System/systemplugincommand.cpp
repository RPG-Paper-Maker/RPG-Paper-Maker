/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemplugincommand.h"
#include "dialogsystemplugincommand.h"
#include "systempluginparameter.h"
#include "rpm.h"

const QString SystemPluginCommand::JSON_DESCRIPTION = "d";
const QString SystemPluginCommand::JSON_DEFAULT_PARAMETERS = "dp";
const QString SystemPluginCommand::DEFAULT_DESCRIPTION = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPluginCommand::SystemPluginCommand() :
    SystemPluginCommand(1, "")
{

}

SystemPluginCommand::SystemPluginCommand(int i, QString n, QString d,
    QStandardItemModel *dp) :
    SuperListItem(i, n, false, false),
    m_description(d),
    m_defaultParameters(dp)
{

}

SystemPluginCommand::~SystemPluginCommand()
{
    delete m_defaultParameters;
}

QString SystemPluginCommand::description() const
{
    return m_description;
}

QStandardItemModel * SystemPluginCommand::defaultParameters() const
{
    return m_defaultParameters;
}

void SystemPluginCommand::setDescription(QString description)
{
    m_description = description;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemPluginCommand::initializeHeaders()
{
    m_defaultParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::DEFAULT_VALUE)}));
}

// -------------------------------------------------------

void SystemPluginCommand::clearDefaultParameters()
{
    SuperListItem::deleteModel(m_defaultParameters, false);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemPluginCommand::toStringName() const
{
    QString str = SuperListItem::beginningText + p_name + RPM::PARENTHESIS_LEFT;
    QStringList list;
    SuperListItem *super;
    for (int i = 0, l = m_defaultParameters->invisibleRootItem()->rowCount(); i
        < l; i++)
    {
        super = SuperListItem::getItemModelAt(m_defaultParameters, i);
        if (super != nullptr)
        {
            list << super->name();
        }
    }
    str += list.join(RPM::COMMA) + RPM::PARENTHESIS_RIGHT;
    return str;
}

// -------------------------------------------------------

bool SystemPluginCommand::openDialog()
{
    SystemPluginCommand command;
    command.setCopy(*this);
    DialogSystemPluginCommand dialog(command);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(command);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemPluginCommand::createCopy() const
{
    SystemPluginCommand *super = new SystemPluginCommand;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPluginCommand::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);

    const SystemPluginCommand *plugin = reinterpret_cast<const
        SystemPluginCommand *>(&super);
    m_description = plugin->m_description;
    this->clearDefaultParameters();
    SuperListItem::copy(m_defaultParameters, plugin->m_defaultParameters);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemPluginCommand::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    // Clear model
    SuperListItem::deleteModel(m_defaultParameters, false);

    if (json.contains(JSON_DESCRIPTION))
    {
        m_description = json[JSON_DESCRIPTION].toString();
    }
    SuperListItem::readTree(m_defaultParameters, new SystemPluginParameter, json
        , JSON_DEFAULT_PARAMETERS);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemPluginCommand::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_description != DEFAULT_DESCRIPTION)
    {
        json[JSON_DESCRIPTION] = m_description;
    }
    SuperListItem::writeTree(m_defaultParameters, json, JSON_DEFAULT_PARAMETERS);
}
