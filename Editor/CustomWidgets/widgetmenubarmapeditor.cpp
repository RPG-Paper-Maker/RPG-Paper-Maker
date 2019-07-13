/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QStyleOptionMenuItem>
#include "widgetmenubarmapeditor.h"
#include "ui_widgetmenubarmapeditor.h"
#include "common.h"

QColor WidgetMenuBarMapEditor::colorBackgroundSelected(95, 158, 160);
QColor WidgetMenuBarMapEditor::colorBackgroundRightSelected(120, 163, 131);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMenuBarMapEditor::WidgetMenuBarMapEditor(QWidget *parent, bool selection) :
    QMenuBar(parent),
    ui(new Ui::WidgetMenuBarMapEditor),
    m_selectionKind(MapEditorSelectionKind::Land),
    m_selection(selection),
    m_actionHeight(nullptr),
    m_actionHeightPlus(nullptr),
    m_actionPencil(nullptr),
    m_actionRectangle(nullptr),
    m_actionPin(nullptr),
    m_actionLayerNone(nullptr),
    m_actionLayerOn(nullptr)
{
    ui->setupUi(this);

    if (m_selection) {
        for (int i = 0; i < this->actions().size(); i++)
            actions().at(i)->setProperty("selection", false);
        actions().at(static_cast<int>(m_selectionKind))->setProperty("selection",
            true);
    }
}

WidgetMenuBarMapEditor::~WidgetMenuBarMapEditor()
{
    if (this->cornerWidget() != nullptr)
        delete this->cornerWidget();

    if (m_actionPencil != nullptr) {
        delete m_actionHeight;
        delete m_actionHeightPlus;
        delete m_actionPencil;
        delete m_actionRectangle;
        delete m_actionPin;
        delete m_actionLayerNone;
        delete m_actionLayerOn;
    }

    delete ui;
}

MapEditorSelectionKind WidgetMenuBarMapEditor::selectionKind() const {
    return m_selectionKind;
}

MapEditorSubSelectionKind WidgetMenuBarMapEditor::subSelectionKind() {
    WidgetMenuBarMapEditor *bar = (m_selection) ? this : reinterpret_cast<
        WidgetMenuBarMapEditor *>(this->parent());
    QString text = bar->actions().at(static_cast<int>(bar->selectionKind()))
        ->text();

    if (text == bar->actionFloors()->text())
        return MapEditorSubSelectionKind::Floors;
    else if (text == bar->actionAutotiles()->text())
        return MapEditorSubSelectionKind::Autotiles;
    else if (text == bar->actionFaceSprite()->text())
        return MapEditorSubSelectionKind::SpritesFace;
    else if (text == bar->actionFixSprite()->text())
        return MapEditorSubSelectionKind::SpritesFix;
    else if (text == bar->actionDoubleSprite()->text())
        return MapEditorSubSelectionKind::SpritesDouble;
    else if (text == bar->actionQuadraSprite()->text())
        return MapEditorSubSelectionKind::SpritesQuadra;
    else if (text == bar->actionWallSprite()->text())
        return MapEditorSubSelectionKind::SpritesWall;
    else if (text == bar->actionMountain()->text())
        return MapEditorSubSelectionKind::Mountains;
    else if (text == bar->actionObject3D()->text())
        return MapEditorSubSelectionKind::Object3D;
    else if (text == bar->actionEvents()->text())
        return MapEditorSubSelectionKind::Object;

    return MapEditorSubSelectionKind::None;
}

DrawKind WidgetMenuBarMapEditor::drawKind() {
    WidgetMenuBarMapEditor *bar = (m_selection) ? reinterpret_cast<
        WidgetMenuBarMapEditor *>(this->cornerWidget()) : this;
    int index = static_cast<int>(MapEditorModesKind::DrawPencil);

    if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Pencil;
    else if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Rectangle;
    else if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Pin;

    return DrawKind::Pencil;
}

bool WidgetMenuBarMapEditor::layerOn() const {
    WidgetMenuBarMapEditor *bar = reinterpret_cast<WidgetMenuBarMapEditor *>(
        this->cornerWidget());
    int index = static_cast<int>(MapEditorModesKind::LayerNone);

    if (bar->actions().at(index++)->property("selection") == true)
        return false;
    else if (bar->actions().at(index++)->property("selection") == true)
        return true;

    return false;
}

QAction * WidgetMenuBarMapEditor::actionFloors() const {
    return ui->actionFloors;
}

QAction * WidgetMenuBarMapEditor::actionAutotiles() const {
    return ui->actionAutotile;
}

QAction * WidgetMenuBarMapEditor::actionFaceSprite() const {
    return ui->actionFace_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionFixSprite() const {
    return ui->actionFix_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionDoubleSprite() const {
    return ui->actionDouble_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionQuadraSprite() const {
    return ui->actionQuadra_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionWallSprite() const {
    return ui->actionWall_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionMountain() const {
    return ui->actionMountain;
}

QAction * WidgetMenuBarMapEditor::actionObject3D() const {
    return ui->action3D_object;
}

QAction * WidgetMenuBarMapEditor::actionEvents() const {
    return ui->actionEvents;
}

QAction * WidgetMenuBarMapEditor::actionPencil() const {
    return m_actionPencil;
}

QAction * WidgetMenuBarMapEditor::actionRectangle() const {
    return m_actionRectangle;
}

QAction * WidgetMenuBarMapEditor::actionPin() const {
    return m_actionPin;
}

QAction * WidgetMenuBarMapEditor::actionLayerNone() const {
    return m_actionLayerNone;
}

QAction * WidgetMenuBarMapEditor::actionLayerOn() const {
    return m_actionLayerOn;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool WidgetMenuBarMapEditor::containsMenu() const {
    QAction * action = this->activeAction();
    if (action != nullptr && action->menu() != nullptr) {
        return action->menu()->rect().contains(action->menu()->mapFromGlobal(
            QCursor::pos()));
    }

    return false;
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::initializeRightMenu() {
    WidgetMenuBarMapEditor *bar = new WidgetMenuBarMapEditor(this, false);
    bar->clear();

    // Draw mode
    m_actionPencil = new QAction(QIcon(":/icons/Ressources/pencil.png"), "Pencil");
    m_actionPencil->setProperty("selection", true);
    m_actionRectangle = new QAction(QIcon(":/icons/Ressources/rectangle.png"),
        "Rectangle");
    m_actionRectangle->setEnabled(false);
    m_actionRectangle->setProperty("selection", false);
    m_actionPin = new QAction(QIcon(":/icons/Ressources/pin.png"), "Pin of paint");
    m_actionPin->setProperty("selection", false);
    bar->addAction(m_actionPencil);
    bar->addAction(m_actionRectangle);
    bar->addAction(m_actionPin);
    bar->addAction("|");

    // Layer
    m_actionLayerNone = new QAction(QIcon(":/icons/Ressources/layer_none.png"),
        "Normal");
    m_actionLayerNone->setProperty("selection", true);
    m_actionLayerOn = new QAction(QIcon(":/icons/Ressources/layer_on.png"),
        "On top");
    m_actionLayerOn->setProperty("selection", false);
    bar->addAction(m_actionLayerNone);
    bar->addAction(m_actionLayerOn);

    this->setCornerWidget(bar);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::toggleSelection() {
    QAction *action;
    int index, count;

    count = this->countSelectionKind();
    index = static_cast<int>(m_selectionKind);

    do {
        index = Common::modulo(index + 1, count);
        action = actions().at(index);
    } while(!action->isEnabled());

    this->updateSelection(action);
}

// -------------------------------------------------------

int WidgetMenuBarMapEditor::countSelectionKind() const {
    int nb = 0;

    for (int i = static_cast<int>(MapEditorSelectionKind::Land); i != static_cast<
        int>(MapEditorSelectionKind::None); i++)
    {
        nb++;
    }

    return nb;
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSelection(QAction *action) {
    MapEditorSubSelectionKind subSelectionBefore = subSelectionKind();

    // Deselect previous selected action
    actions().at(static_cast<int>(m_selectionKind))->setProperty("selection",
        false);

    // Select the pressed action
    m_selectionKind = static_cast<MapEditorSelectionKind>(actions().indexOf(
        action));

    action->setProperty("selection", true);

    // Force none if sprite walls
    MapEditorSubSelectionKind subSelectionAfter = subSelectionKind();
    if (subSelectionBefore != subSelectionAfter) {
        enableAllRight();
        if (subSelectionAfter == MapEditorSubSelectionKind::SpritesWall ||
            m_selectionKind == MapEditorSelectionKind::Objects3D ||
            m_selectionKind == MapEditorSelectionKind::Mountains)
        {
            forceNoneLayer();
        } else {
            actionLayerOn()->setIcon(QIcon(":/icons/Ressources/layer_on.png"));
        }
        if (m_selectionKind == MapEditorSelectionKind::Sprites ||
            m_selectionKind == MapEditorSelectionKind::Objects3D ||
            m_selectionKind == MapEditorSelectionKind::Mountains)
        {
            forcePencil();
        } else {
            actionPin()->setIcon(QIcon(":/icons/Ressources/pin.png"));
        }
    }

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateMenutext(QMenu *menu, QAction *action) {
    menu->setTitle(action->text());
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSubSelection(QMenu *menu, QAction
    *menuAction, QAction *action)
{
    updateMenutext(menu, action);
    updateSelection(menuAction);
    enableAllRight();
    if (subSelectionKind() == MapEditorSubSelectionKind::SpritesWall)
        forceNoneLayer();
    else
        actionLayerOn()->setIcon(QIcon(":/icons/Ressources/layer_on.png"));
    if (m_selectionKind == MapEditorSelectionKind::Sprites || m_selectionKind ==
        MapEditorSelectionKind::Objects3D) {
        forcePencil();
    } else {
        actionPin()->setIcon(QIcon(":/icons/Ressources/pin.png"));
    }
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateRight(QAction *action)
{
    WidgetMenuBarMapEditor *bar = getBarRight();

    int index = bar->actions().indexOf(action);
    QList<int> list;
    list << static_cast<int>(MapEditorModesKind::DrawPencil) << static_cast<int>
        (MapEditorModesKind::DrawPin) << static_cast<int>(
        MapEditorModesKind::LayerNone)<< static_cast<int>(
        MapEditorModesKind::LayerOn);

    // Deselect previous selected action
    for (int i = 0; i < list.size() / 2; i++) {
        int l = list.at(i * 2);
        int r = list.at(i * 2 + 1);
        if (index >= l && index <= r) {
            for (int i = l; i <= r; i++)
                bar->actions().at(i)->setProperty("selection", false);
        }
    }

    // Select the pressed action
    action->setProperty("selection", true);

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceNoneLayer() {
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(5);
    forceRight(4);
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/layer_on_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forcePencil() {
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(2);
    forceRight(0);
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/pin_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceRight(int i) {
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(i);
    updateRight(action);
}

// -------------------------------------------------------

WidgetMenuBarMapEditor * WidgetMenuBarMapEditor::getBarRight() {
    return (m_selection) ? reinterpret_cast<WidgetMenuBarMapEditor *>(this
        ->cornerWidget()) : this;
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::enableAllRight() {
    actionPencil()->setEnabled(true);
    actionPin()->setEnabled(true);
    actionLayerNone()->setEnabled(true);
    actionLayerOn()->setEnabled(true);
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::mouseMoveEvent(QMouseEvent *event) {
    this->setActiveAction(this->actionAt(event->pos()));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::mousePressEvent(QMouseEvent *event) {
    QAction *action = this->actionAt(event->pos());
    if (m_selection) {
        if (action != nullptr && action->isEnabled()) {
            updateSelection(action);

            emit selectionChanged();
        }
    }
    else {
        if (action != nullptr && action->text() != "|" && action->isEnabled())
            updateRight(action);
    }

    QMenuBar::mousePressEvent(event);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::paintEvent(QPaintEvent *e) {
    QPainter p(this);

    // Draw the items
    for (int i = 0; i < actions().size(); ++i) {
        QAction *action = actions().at(i);
        QRect adjustedActionRect = this->actionGeometry(action);

        // Fill by the magic color the selected item
        if (action->property("selection") == true) {
            if (m_selection)
                p.fillRect(adjustedActionRect, colorBackgroundSelected);
            else
                p.fillRect(adjustedActionRect, colorBackgroundRightSelected);
        }

        // Draw all the other stuff (text, special background..)
        if (adjustedActionRect.isEmpty() || !action->isVisible())
            continue;
        if(!e->rect().intersects(adjustedActionRect))
            continue;

        QStyleOptionMenuItem opt;
        initStyleOption(&opt, action);
        opt.rect = adjustedActionRect;

        // Drawing separator and disabled with darker color
        if (opt.icon.isNull()) {
            if (action->text() == "|" || !action->isEnabled())
                p.setPen(QColor(100, 100, 100));
            else
                p.setPen(Qt::white);
            p.drawText(adjustedActionRect, action->text(),
                       QTextOption(Qt::AlignCenter));
            opt.text = "";
        }

        style()->drawControl(QStyle::CE_MenuBarItem, &opt, &p, this);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFloors_triggered(QAction *action) {
    updateSubSelection(ui->menuFloors, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Land)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFace_Sprite_triggered(QAction *action) {
    updateSubSelection(ui->menuFace_Sprite, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Sprites)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuMountain_triggered(QAction *action) {
    updateSubSelection(ui->menuMountain, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Mountains)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menu3D_object_triggered(QAction *action) {
    updateSubSelection(ui->menu3D_object, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Objects3D)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuEvents_triggered(QAction *action) {
    updateSubSelection(ui->menuEvents, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Objects)), action);
}
