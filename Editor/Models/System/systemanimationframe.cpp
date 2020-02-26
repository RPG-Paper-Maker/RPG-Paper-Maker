/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimationframe.h"
#include "systemanimationframeeffect.h"

const QString SystemAnimationFrame::JSON_ELEMENTS = "e";
const QString SystemAnimationFrame::JSON_EFFECTS = "ef";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimationFrame::SystemAnimationFrame() :
    SystemAnimationFrame(1, "")
{

}

SystemAnimationFrame::SystemAnimationFrame(int i, QString n) :
    SuperListItem(i, n),
    m_modelEffects(new QStandardItemModel)
{

}

SystemAnimationFrame::~SystemAnimationFrame() {
    this->clearElements();
    SuperListItem::deleteModel(m_modelEffects);
}

int SystemAnimationFrame::elementsCount() const {
    return m_elements.size();
}

SystemAnimationFrameElement * SystemAnimationFrame::elementAt(int i) const {
    return m_elements.at(i);
}

QStandardItemModel * SystemAnimationFrame::modelEffects() const {
    return m_modelEffects;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int SystemAnimationFrame::getElementMaxIndex() const {
    int i, l, index, id;

    index = 0;
    for (i = 0, l = m_elements.size(); i < l; i++) {
        id = m_elements.at(i)->id();
        if (id > index) {
            index = id;
        }
    }

    return index;
}

// -------------------------------------------------------

void SystemAnimationFrame::clear() {
    this->clearElements();
    this->setName("");
    SuperListItem::deleteModel(m_modelEffects, false);
}

// -------------------------------------------------------

void SystemAnimationFrame::clearElements() {
    for (int i = 0, l = m_elements.size(); i < l; i++) {
        delete m_elements.at(i);
    }
    m_elements.clear();
}

// -------------------------------------------------------

void SystemAnimationFrame::initializeHeader() {
    m_modelEffects->setHorizontalHeaderLabels(QStringList({"Type / ID",
        "Condition"}));
}

// -------------------------------------------------------

SystemAnimationFrameElement * SystemAnimationFrame::addElement(int x, int y, int
    row, int column)
{
    SystemAnimationFrameElement *element;

    element = new SystemAnimationFrameElement(this->getElementMaxIndex() + 1, ""
        , x, y, row, column);
    this->addElement(element);

    return element;
}

// -------------------------------------------------------

void SystemAnimationFrame::addElement(SystemAnimationFrameElement *element)
{
    m_elements.append(element);
}

// -------------------------------------------------------

void SystemAnimationFrame::deleteElement(SystemAnimationFrameElement *element) {
    for (int i = 0, l = m_elements.size(); i < l; i++) {
        if (element == m_elements.at(i)) {
            m_elements.removeAt(i);
            delete element;
            break;
        }
    }
}

// -------------------------------------------------------

void SystemAnimationFrame::reorder(SystemAnimationFrameElement *element) {
    int i, l;

    // Remove edited element
    for (i = 0, l = m_elements.size(); i < l; i++) {
        if (element == m_elements.at(i)) {
            m_elements.removeAt(i);
            break;
        }
    }
    // Re-place it in the right order according to new index
    for (i = 0, l = m_elements.size(); i < l; i++) {
        if (m_elements.at(i)->id() >= element->id()) {
            m_elements.insert(i, element);
            return;
        }
    }
    m_elements.append(element);
}

// -------------------------------------------------------

QList<SystemAnimationFrameElement *> SystemAnimationFrame::getAllElementsWithID(
    int id)
{
    QList<SystemAnimationFrameElement *> elements;
    SystemAnimationFrameElement *element;
    int i, l;

    for (i = 0, l = m_elements.size(); i < l; i++) {
        element = m_elements.at(i);
        if (element->id() > id) {
            return elements;
        } else if (element->id() == id) {
            elements.append(element);
        }
    }

    return elements;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemAnimationFrame::createCopy() const {
    SystemAnimationFrame *super = new SystemAnimationFrame;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAnimationFrame::setCopy(const SuperListItem &super) {
    const SystemAnimationFrame *sys;
    int i, l;

    SuperListItem::setCopy(super);
    sys = reinterpret_cast<const SystemAnimationFrame *>(&super);
    this->clearElements();
    for (i = 0, l = sys->m_elements.size(); i < l; i++) {
        m_elements.append(reinterpret_cast<SystemAnimationFrameElement *>(sys
            ->m_elements.at(i)->createCopy()));
    }
    SuperListItem::deleteModel(m_modelEffects, false);
    SuperListItem::copy(m_modelEffects, sys->m_modelEffects);
    this->initializeHeader();
}

// -------------------------------------------------------

void SystemAnimationFrame::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonArray tab;
    SystemAnimationFrameElement *element;
    int i, l;

    // Clear
    SuperListItem::deleteModel(m_modelEffects, false);

    tab = json[JSON_ELEMENTS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        element = new SystemAnimationFrameElement;
        element->read(tab.at(i).toObject());
        m_elements.append(element);
    }

    this->initializeHeader();
    SuperListItem::readTree(m_modelEffects, new SystemAnimationFrameEffect, json
        , JSON_EFFECTS);
}

// -------------------------------------------------------

void SystemAnimationFrame::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    for (i = 0, l = m_elements.size(); i < l; i++) {
        obj = QJsonObject();
        m_elements.at(i)->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[JSON_ELEMENTS] = tab;
    }

    SuperListItem::writeTree(m_modelEffects, json, JSON_EFFECTS);
}
