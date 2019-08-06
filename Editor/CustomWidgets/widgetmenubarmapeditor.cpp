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
    m_actionTranslate(nullptr),
    m_actionRotate(nullptr),
    m_actionScale(nullptr),
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
        delete m_actionTranslate;
        delete m_actionRotate;
        delete m_actionScale;
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
    int index = static_cast<int>(MapEditorModesKind::TransformTranslate);

    if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Translate;
    else if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Rotate;
    else if (bar->actions().at(index++)->property("selection") == true)
        return DrawKind::Scale;
    else if (bar->actions().at(index++)->property("selection") == true)
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

QAction * WidgetMenuBarMapEditor::actionTranslate() const {
    return m_actionTranslate;
}

QAction * WidgetMenuBarMapEditor::actionRotate() const {
    return m_actionRotate;
}

QAction * WidgetMenuBarMapEditor::actionScale() const {
    return m_actionScale;
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
    m_actionTranslate = new QAction(QIcon(":/icons/Ressources/translate_disable.png"), "Translate");
    m_actionTranslate->setProperty("selection", false);
    m_actionTranslate->setEnabled(false);
    m_actionRotate = new QAction(QIcon(":/icons/Ressources/rotate_disable.png"), "Rotate");
    m_actionRotate->setProperty("selection", false);
    m_actionRotate->setEnabled(false);
    m_actionScale = new QAction(QIcon(":/icons/Ressources/scale_disable.png"), "Scale");
    m_actionScale->setProperty("selection", false);
    m_actionScale->setEnabled(false);
    m_actionPencil = new QAction(QIcon(":/icons/Ressources/pencil.png"), "Pencil");
    m_actionPencil->setProperty("selection", true);
    m_actionRectangle = new QAction(QIcon(":/icons/Ressources/rectangle.png"),
        "Rectangle");
    m_actionRectangle->setEnabled(false);
    m_actionRectangle->setProperty("selection", false);
    m_actionPin = new QAction(QIcon(":/icons/Ressources/pin.png"), "Pin of paint");
    m_actionPin->setProperty("selection", false);
    bar->addAction(m_actionTranslate);
    bar->addAction(m_actionRotate);
    bar->addAction(m_actionScale);
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
    MapEditorSubSelectionKind subSelectionAfter = this->subSelectionKind();
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
        if (m_selectionKind == MapEditorSelectionKind::Land || (m_selectionKind
            == MapEditorSelectionKind::Sprites && (subSelectionAfter ==
            MapEditorSubSelectionKind::SpritesFace || subSelectionAfter ==
            MapEditorSubSelectionKind::SpritesWall)) || m_selectionKind ==
            MapEditorSelectionKind::Mountains || m_selectionKind ==
            MapEditorSelectionKind::Objects)
        {
            this->forceNoRotation();
        } else {
            this->actionRotate()->setIcon(QIcon(":/icons/Ressources/rotate.png"));
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
    MapEditorSubSelectionKind subKind;

    this->updateMenutext(menu, action);
    this->updateSelection(menuAction);
    this->enableAllRight();
    subKind = this->subSelectionKind();
    if (subKind == MapEditorSubSelectionKind::SpritesWall) {
        this->forceNoneLayer();
    } else {
        this->actionLayerOn()->setIcon(QIcon(":/icons/Ressources/layer_on.png"));
    }
    if (m_selectionKind == MapEditorSelectionKind::Sprites || m_selectionKind ==
        MapEditorSelectionKind::Objects3D)
    {
        this->forcePencil();
    } else {
        this->actionPin()->setIcon(QIcon(":/icons/Ressources/pin.png"));
    }
    if (m_selectionKind == MapEditorSelectionKind::Land || (m_selectionKind ==
        MapEditorSelectionKind::Sprites && (subKind == MapEditorSubSelectionKind
        ::SpritesFace || subKind == MapEditorSubSelectionKind::SpritesWall)) ||
        m_selectionKind == MapEditorSelectionKind::Mountains || m_selectionKind
        == MapEditorSelectionKind::Objects)
    {
        this->forceNoRotation();
    } else {
        this->actionRotate()->setIcon(QIcon(":/icons/Ressources/rotate.png"));
    }
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateRight(QAction *action)
{
    WidgetMenuBarMapEditor *bar;

    QList<int> listLeft, listRight;
    QList<int> &list = listLeft;
    int index;

    bar = getBarRight();
    index = bar->actions().indexOf(action);
    listLeft <<
        static_cast<int>(MapEditorModesKind::TransformRotate) << static_cast<int>(
        MapEditorModesKind::DrawPencil) << static_cast<int>(MapEditorModesKind
        ::DrawPin);
    listRight << static_cast<int>(MapEditorModesKind::LayerNone) << static_cast<
        int>(MapEditorModesKind::LayerOn);

    // Deselect previous selected action
    if (index >= static_cast<int>(MapEditorModesKind::LayerNone)) {
        list = listRight;
    }
    for (int i = 0; i < list.size(); i++) {
        bar->actions().at(list.at(i))->setProperty("selection", false);
    }

    // Select the pressed action
    action->setProperty("selection", true);

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceNoneLayer() {
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(static_cast<int>(MapEditorModesKind
        ::LayerOn));
    forceRight(static_cast<int>(MapEditorModesKind::LayerNone));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/layer_on_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceNoRotation() {
    WidgetMenuBarMapEditor *bar;
    QAction *action;

    bar = getBarRight();
    forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
    action = bar->actions().at(static_cast<int>(MapEditorModesKind
        ::TransformRotate));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/rotate_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forcePencil() {
    WidgetMenuBarMapEditor *bar;
    QAction *action;
    int index;

    bar = getBarRight();
    index = bar->actions().indexOf(action);
    if (index == static_cast<int>(MapEditorModesKind::DrawPin)) {
        forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
    }
    action = bar->actions().at(static_cast<int>(MapEditorModesKind::DrawPin));
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
    actionRotate()->setEnabled(true);
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
