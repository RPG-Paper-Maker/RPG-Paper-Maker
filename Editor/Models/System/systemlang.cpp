/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemlang.h"
#include "dialogsystemlang.h"
#include "rpm.h"

const QString SystemLang::JSON_NAMES = "names";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemLang::SystemLang() :
    SystemLang(-1, "")
{

}

SystemLang::SystemLang(int i, QString name) :
    SuperListItem(i, name)
{
    this->setMainName(name);
}

SystemLang::SystemLang(int i, QVector<int> ids, QVector<QString> names) :
    SuperListItem(i, "")
{
    for (int i = 0, l = ids.size(); i < l; i++)
    {
        m_names[ids[i]] = names[i];
    }
    this->setName(this->mainName());
}

SystemLang::~SystemLang()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int SystemLang::mainID() const
{
    return RPM::get()->project() == nullptr ? 1 : RPM::get()->project()
        ->langsDatas()->mainLang();;
}

// -------------------------------------------------------

QString SystemLang::mainName() const
{
    return m_names[this->mainID()];
}

// -------------------------------------------------------

void SystemLang::setMainName(QString n)
{
    m_names[this->mainID()] = n;
}

// -------------------------------------------------------

QString SystemLang::defaultMainName() const
{
    return m_names[1];
}

// -------------------------------------------------------

void SystemLang::updateNames()
{
    QHash<int, QString> names = m_names;
    QStandardItemModel *model = RPM::get()->project()->langsDatas()->model();
    SystemLang *entry;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l
         - 1; i++)
    {
        entry = reinterpret_cast<SystemLang *>(SuperListItem::getItemModelAt(model, i));
        if (entry != nullptr)
        {
            m_names[entry->id()] = names[entry->id()];
        }
    }
}

// -------------------------------------------------------

void SystemLang::setAllNames(QString n)
{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        m_names[i.key()] = n;
    }
}

// -------------------------------------------------------

bool SystemLang::isEmpty() const
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

void SystemLang::setDefault()
{
    this->setName(p_name);
}

// -------------------------------------------------------

QString SystemLang::name() const
{
    return this->mainName();
}

// -------------------------------------------------------

void SystemLang::setName(QString n)
{
    SuperListItem::setName(n);
    this->setMainName(n);
}

// -------------------------------------------------------

void SystemLang::getCommand(QVector<QString> &command)
{
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        command.append(QString::number(i.key()));
        command.append(i.value());
    }
}

// -------------------------------------------------------

void SystemLang::initializeCommand(const EventCommand *command, int &i)
{
    int id = command->valueCommandAt(i++).toInt();
    QString name = command->valueCommandAt(i++);
    m_names[id] = name;
}

// -------------------------------------------------------

bool SystemLang::openDialog()
{
    SystemLang super;
    super.setCopy(*this);
    DialogSystemLang dialog(super);
    if (dialog.exec() == QDialog::Accepted)
    {
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemLang::createCopy() const
{
    SystemLang* super = new SystemLang;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemLang::setCopy(const SuperListItem &super)
{
    const SystemLang *lang = reinterpret_cast<const SystemLang *>(&super);
    SuperListItem::setCopy(*lang);
    m_names = lang->m_names;
    this->setName(this->mainName());
}

// -------------------------------------------------------

void SystemLang::read(const QJsonObject &json)
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

void SystemLang::write(QJsonObject &json) const
{
    SuperListItem::writeId(json);
    QJsonObject obj;
    QHash<int, QString>::const_iterator i;
    for (i = m_names.begin(); i != m_names.end(); i++) {
        obj[QString::number(i.key())] = i.value();
    }
    json[JSON_NAMES] = obj;
}
