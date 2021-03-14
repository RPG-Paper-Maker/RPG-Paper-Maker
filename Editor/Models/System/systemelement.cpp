/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemelement.h"
#include "dialogsystemelement.h"
#include "rpm.h"

const QString SystemElement::JSON_EFFICIENCY = "e";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemElement::SystemElement() :
    SystemElement(1, "", -1)
{

}

SystemElement::SystemElement(int i, QString name, int ii) :
    SystemIcon(i,name, ii),
    m_modelEfficiency(new QStandardItemModel)
{

}

SystemElement::~SystemElement() {
    this->clearEfficiency();
    SuperListItem::deleteModel(m_modelEfficiency);
}

QStandardItemModel * SystemElement::modelEfficiency() const {
    return m_modelEfficiency;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemElement::clearEfficiency() {
    QHash<int, PrimitiveValue *>::iterator i;

    for (i = m_efficiency.begin(); i != m_efficiency.end(); i++) {
        delete *i;
    }
    m_efficiency.clear();
}

// -------------------------------------------------------

void SystemElement::addEfficiencyDouble(int id, double d) {
    m_efficiency.insert(id, new PrimitiveValue(d));
}

// -------------------------------------------------------

void SystemElement::updateEfficiency() {
    SystemElement *element;
    PrimitiveValue *prim;
    SystemPrimitive *sys;
    int i, l;

    SuperListItem::deleteModel(m_modelEfficiency, false);
    m_modelEfficiency->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::ELEMENTS), RPM::translate(Translations::EFFICIENCY)}));

    for (i = 0, l = RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelElements()->invisibleRootItem()->rowCount(); i < l; i++)
    {
        element = reinterpret_cast<SystemElement *>(RPM::get()->project()
            ->gameDatas()->battleSystemDatas()->modelElements()->item(i)->data()
            .value<quintptr>());
        prim = m_efficiency.value(element->id());
        prim = prim == nullptr ? new PrimitiveValue(1.0) : prim->createCopy();
        sys = new SystemPrimitive(element->id(), element->name(), prim,
            SystemPrimitiveKind::ElementEfficiency);
        m_modelEfficiency->appendRow(sys->getModelRow());
    }
}

// -------------------------------------------------------

void SystemElement::updateEfficiencyChange() {
    PrimitiveValue *prim;
    SystemPrimitive *sys;
    int i, l;

    for (i = 0, l = m_modelEfficiency->invisibleRootItem()->rowCount(); i < l;
         i++)
    {
        sys = reinterpret_cast<SystemPrimitive *>(m_modelEfficiency->item(i)
            ->data().value<quintptr>());

        prim = m_efficiency.value(sys->id());
        if (prim != nullptr) {
            delete prim;
        }
        m_efficiency.insert(sys->id(), sys->prim()->createCopy());
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemElement::openDialog() {
    SystemElement element;
    element.setCopy(*this);
    DialogSystemElement dialog(element);

    if (dialog.exec() == QDialog::Accepted) {
        element.updateEfficiencyChange();
        this->setCopy(element);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemElement::createCopy() const{
    SystemElement* super = new SystemElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemElement::setCopy(const SuperListItem &super) {
    const SystemElement *element;

    SystemIcon::setCopy(super);
    element = reinterpret_cast<const SystemElement *>(&super);
    this->clearEfficiency();
    SuperListItem::deleteModel(m_modelEfficiency, false);
    QHash<int, PrimitiveValue *>::const_iterator i;
    for (i = element->m_efficiency.begin(); i != element->m_efficiency.end();
        i++)
    {
        m_efficiency.insert(i.key(), i.value()->createCopy());
    }
    this->updateEfficiency();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemElement::read(const QJsonObject &json){
    SystemIcon::read(json);
    QJsonArray tab;
    QJsonObject obj;
    PrimitiveValue *prim;
    int i, l;

    this->clearEfficiency();
    tab = json[JSON_EFFICIENCY].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        obj = tab.at(i).toObject();
        prim = new PrimitiveValue;
        prim->read(obj[RPM::JSON_VALUE].toObject());
        m_efficiency.insert(obj[RPM::JSON_KEY].toInt(), prim);
    }
}

// -------------------------------------------------------

void SystemElement::write(QJsonObject &json) const {
    SystemIcon::write(json);
    QJsonArray tab;
    QJsonObject obj;
    QJsonObject objValue;
    QHash<int, PrimitiveValue *>::const_iterator i;

    for (i = m_efficiency.begin(); i != m_efficiency.end(); i++) {
        if (i.value()->numberDoubleValue() != 1.0) {
            objValue = QJsonObject();
            i.value()->write(objValue);
            obj = QJsonObject();
            obj[RPM::JSON_KEY] = i.key();
            obj[RPM::JSON_VALUE] = objValue;
            tab.append(obj);
        }
    }

    json[JSON_EFFICIENCY] = tab;
}
