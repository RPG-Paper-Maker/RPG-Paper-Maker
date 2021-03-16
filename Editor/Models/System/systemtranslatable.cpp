/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtranslatable.h"
#include "dialogsystemtranslatable.h"
#include "rpm.h"

const QString SystemTranslatable::JSON_NAMES = "names";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTranslatable::SystemTranslatable() :
    SystemTranslatable(-1, "")
{

}

SystemTranslatable::SystemTranslatable(int i, QString name) :
    SuperListItem(i, name)
{
    this->setMainName(name);
}

SystemTranslatable::SystemTranslatable(int i, QVector<int> ids, QVector<QString> names) :
    SuperListItem(i, "")
{
    for (int i = 0, l = ids.size(); i < l; i++)
    {
        m_names[ids[i]] = names[i];
    }
    this->setName(this->mainName());
}

SystemTranslatable::~SystemTranslatable()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int SystemTranslatable::mainID() const
{
    return RPM::get()->project() == nullptr ? 1 : RPM::get()->project()
        ->langsDatas()->mainLang();;
}

// -------------------------------------------------------

QString SystemTranslatable::mainName() const
{
    return m_names[this->mainID()];
}


// -------------------------------------------------------

QString SystemTranslatable::specificName(int id) const
{
    return m_names[id];
}

// -------------------------------------------------------

void SystemTranslatable::setMainName(QString n)
{
    this->setSpecificName(this->mainID(), n);
}

// -------------------------------------------------------

void SystemTranslatable::setSpecificName(int id, QString n)
{
    m_names[id] = n;
}

// -------------------------------------------------------

QString SystemTranslatable::defaultMainName() const
{
    return m_names[1];
}

// -------------------------------------------------------

void SystemTranslatable::updateNames()
{
    QHash<int, QString> names = m_names;
    QStandardItemModel *model = RPM::get()->project()->langsDatas()->model();
    SystemTranslatable *entry;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l
         - 1; i++)
    {
        entry = reinterpret_cast<SystemTranslatable *>(SuperListItem::getItemModelAt(model, i));
        if (entry != nullptr)
        {
            m_names[entry->id()] = names[entry->id()];
        }
    }
}

// -------------------------------------------------------

void SystemTranslatable::setAllNames(QString n)
{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        m_names[i.key()] = n;
    }
}

// -------------------------------------------------------

bool SystemTranslatable::isEmpty() const
{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        if (!i.value().isEmpty()) {
            return false;
        }
    }
    return true;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemTranslatable::setDefault()
{
    this->setName(p_name);
}

// -------------------------------------------------------

QString SystemTranslatable::name() const
{
    return this->mainName();
}

// -------------------------------------------------------

void SystemTranslatable::setName(QString n)
{
    SuperListItem::setName(n);
    this->setMainName(n);
}

// -------------------------------------------------------

void SystemTranslatable::getCommand(QVector<QString> &command)
{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        command.append(QString::number(i.key()));
        command.append(i.value());
    }
}

// -------------------------------------------------------

void SystemTranslatable::initializeCommand(const EventCommand *command, int &i)
{
    int id = command->valueCommandAt(i++).toInt();
    QString name = command->valueCommandAt(i++);
    m_names[id] = name;
}

// -------------------------------------------------------

bool SystemTranslatable::openDialog()
{
    SystemTranslatable super;
    super.setCopy(*this);
    DialogSystemTranslatable dialog(super);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->SystemTranslatable::setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemTranslatable::createCopy() const
{
    SystemTranslatable* super = new SystemTranslatable;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTranslatable::setCopy(const SuperListItem &super)
{
    const SystemTranslatable *lang = reinterpret_cast<const SystemTranslatable *>(&super);
    SuperListItem::setCopy(*lang);
    m_names = lang->m_names;
    this->setName(this->mainName());
}

// -------------------------------------------------------

void SystemTranslatable::read(const QJsonObject &json)
{
    SuperListItem::readId(json);
    QJsonObject obj = json[JSON_NAMES].toObject();
    QJsonObject::const_iterator i;
    for (i = obj.begin(); i != obj.end(); i++) {
        m_names[i.key().toInt()] = i.value().toString();
    }
    setName(this->mainName());
}

// -------------------------------------------------------

void SystemTranslatable::write(QJsonObject &json) const
{
    SuperListItem::writeId(json);
    QJsonObject obj;
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        obj[QString::number(i.key())] = i.value();
    }
    json[JSON_NAMES] = obj;
}
