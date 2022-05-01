/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
#include "mainwindow.h"
#include "rpm.h"

const QColor WidgetMenuBarMapEditor::COLOR_BACKGROUND_SELECTED(95, 158, 160);
const QColor WidgetMenuBarMapEditor::COLOR_BACKGROUND_RIGHT_SELECTED(120, 163, 131);
const char* WidgetMenuBarMapEditor::PROPERTY_SELECTION = "selection";

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
    m_actionSquare(nullptr),
    m_actionPixel(nullptr),
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

    if (m_selection)
    {
        for (int i = 0; i < this->actions().size(); i++)
        {
            actions().at(i)->setProperty(PROPERTY_SELECTION, false);
        }
        actions().at(static_cast<int>(m_selectionKind))->setProperty(PROPERTY_SELECTION, true);
    }
    this->translate();
}

WidgetMenuBarMapEditor::~WidgetMenuBarMapEditor()
{
    if (this->cornerWidget() != nullptr)
    {
        delete this->cornerWidget();
    }
    if (m_actionPencil != nullptr)
    {
        delete m_actionHeight;
        delete m_actionHeightPlus;
        delete m_actionSquare;
        delete m_actionPixel;
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

MapEditorSelectionKind WidgetMenuBarMapEditor::selectionKind() const
{
    return m_selectionKind;
}

MapEditorSubSelectionKind WidgetMenuBarMapEditor::subSelectionKind()
{
    WidgetMenuBarMapEditor *bar = (m_selection) ? this : reinterpret_cast<
        WidgetMenuBarMapEditor *>(this->parent());
    QString text = bar->actions().at(static_cast<int>(bar->selectionKind()))->text();
    if (text == bar->actionFloors()->text())
    {
        return MapEditorSubSelectionKind::Floors;
    } else if (text == bar->actionAutotiles()->text())
    {
        return MapEditorSubSelectionKind::Autotiles;
    } else if (text == bar->actionFaceSprite()->text())
    {
        return MapEditorSubSelectionKind::SpritesFace;
    } else if (text == bar->actionFixSprite()->text())
    {
        return MapEditorSubSelectionKind::SpritesFix;
    } else if (text == bar->actionDoubleSprite()->text())
    {
        return MapEditorSubSelectionKind::SpritesDouble;
    } else if (text == bar->actionQuadraSprite()->text())
    {
        return MapEditorSubSelectionKind::SpritesQuadra;
    } else if (text == bar->actionWallSprite()->text())
    {
        return MapEditorSubSelectionKind::SpritesWall;
    } else if (text == bar->actionMountain()->text())
    {
        return MapEditorSubSelectionKind::Mountains;
    } else if (text == bar->actionObject3D()->text())
    {
        return MapEditorSubSelectionKind::Object3D;
    } else if (text == bar->actionEvents()->text())
    {
        return MapEditorSubSelectionKind::Object;
    }
    return MapEditorSubSelectionKind::None;
}

bool WidgetMenuBarMapEditor::squareOn(bool detection) const
{
    WidgetMenuBarMapEditor *bar = reinterpret_cast<WidgetMenuBarMapEditor *>(
        this->cornerWidget());
    if (bar->actions().at(detection ? 0 : static_cast<int>(MapEditorModesKind
        ::Square))->property(PROPERTY_SELECTION) == true)
    {
        return true;
    }
    return false;
}

DrawKind WidgetMenuBarMapEditor::drawKind()
{
    WidgetMenuBarMapEditor *bar = (m_selection) ? reinterpret_cast<
        WidgetMenuBarMapEditor *>(this->cornerWidget()) : this;
    int index = static_cast<int>(MapEditorModesKind::TransformTranslate);
    if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Translate;
    } else if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Rotate;
    } else if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Scale;
    } else if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Pencil;
    } else if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Rectangle;
    } else if (bar->actions().at(index++)->property(PROPERTY_SELECTION) == true)
    {
        return DrawKind::Pin;
    }
    return DrawKind::Pencil;
}

bool WidgetMenuBarMapEditor::layerOn() const
{
    WidgetMenuBarMapEditor *bar = reinterpret_cast<WidgetMenuBarMapEditor *>(
        this->cornerWidget());
    if (bar->actions().at(static_cast<int>(MapEditorModesKind::LayerOn))
        ->property(PROPERTY_SELECTION) == true)
    {
        return true;
    }
    return false;
}

QAction * WidgetMenuBarMapEditor::actionFloors() const
{
    return ui->actionFloors;
}

QAction * WidgetMenuBarMapEditor::actionAutotiles() const
{
    return ui->actionAutotile;
}

QAction * WidgetMenuBarMapEditor::actionFaceSprite() const
{
    return ui->actionFace_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionFixSprite() const
{
    return ui->actionFix_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionDoubleSprite() const
{
    return ui->actionDouble_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionQuadraSprite() const
{
    return ui->actionQuadra_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionWallSprite() const
{
    return ui->actionWall_Sprite;
}

QAction * WidgetMenuBarMapEditor::actionMountain() const
{
    return ui->actionMountain;
}

QAction * WidgetMenuBarMapEditor::actionObject3D() const
{
    return ui->action3D_object;
}

QAction * WidgetMenuBarMapEditor::actionEvents() const
{
    return ui->actionEvents;
}

QAction * WidgetMenuBarMapEditor::actionView() const
{
    return ui->actionView;
}

QAction * WidgetMenuBarMapEditor::actionSquare() const
{
    return m_actionSquare;
}

QAction * WidgetMenuBarMapEditor::actionPixel() const
{
    return m_actionPixel;
}

QAction * WidgetMenuBarMapEditor::actionTranslate() const
{
    return m_actionTranslate;
}

QAction * WidgetMenuBarMapEditor::actionRotate() const
{
    return m_actionRotate;
}

QAction * WidgetMenuBarMapEditor::actionScale() const
{
    return m_actionScale;
}

QAction * WidgetMenuBarMapEditor::actionPencil() const
{
    return m_actionPencil;
}

QAction * WidgetMenuBarMapEditor::actionRectangle() const
{
    return m_actionRectangle;
}

QAction * WidgetMenuBarMapEditor::actionPin() const
{
    return m_actionPin;
}

QAction * WidgetMenuBarMapEditor::actionLayerNone() const
{
    return m_actionLayerNone;
}

QAction * WidgetMenuBarMapEditor::actionLayerOn() const
{
    return m_actionLayerOn;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

WidgetMenuBarMapEditor * WidgetMenuBarMapEditor::getBarRight()
{
    return (m_selection) ? reinterpret_cast<WidgetMenuBarMapEditor *>(this
        ->cornerWidget()) : this;
}

// -------------------------------------------------------

bool WidgetMenuBarMapEditor::containsMenu() const
{
    QAction * action = this->activeAction();
    if (action != nullptr && action->menu() != nullptr)
    {
        return action->menu()->rect().contains(action->menu()->mapFromGlobal(
            QCursor::pos()));
    }
    return false;
}

// -------------------------------------------------------

int WidgetMenuBarMapEditor::countSelectionKind() const
{
    int nb = 0;
    for (int i = static_cast<int>(MapEditorSelectionKind::Land); i != static_cast<
        int>(MapEditorSelectionKind::None); i++)
    {
        nb++;
    }
    return nb;
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::initializeRightMenu(bool detection)
{
    WidgetMenuBarMapEditor *bar = new WidgetMenuBarMapEditor(this, false);
    bar->clear();

    // Square or pixel mode
    m_actionSquare = new QAction(QIcon(":/icons/Ressources/square.png"), "Square");
    m_actionSquare->setProperty(PROPERTY_SELECTION, true);
    if (detection)
    {
        m_actionPixel = new QAction(QIcon(":/icons/Ressources/pixel.png"), "Pixel");
        m_actionPixel->setEnabled(true);
    } else
    {
        m_actionPixel = new QAction(QIcon(":/icons/Ressources/pixel_disable.png"),
            "Pixel");
        m_actionPixel->setEnabled(false);
    }
    m_actionPixel->setProperty(PROPERTY_SELECTION, false);
    bar->addAction(m_actionSquare);
    bar->addAction(m_actionPixel);
    if (!detection)
    {
        bar->addAction("|");

        // Draw mode
        m_actionTranslate = new QAction(QIcon(":/icons/Ressources/translate_disable.png"), "Translate");
        m_actionTranslate->setProperty(PROPERTY_SELECTION, false);
        m_actionTranslate->setEnabled(false);
        m_actionRotate = new QAction(QIcon(":/icons/Ressources/rotate.png"), "Rotate");
        m_actionRotate->setProperty(PROPERTY_SELECTION, false);
        m_actionRotate->setEnabled(true);
        m_actionScale = new QAction(QIcon(":/icons/Ressources/scale_disable.png"), "Scale");
        m_actionScale->setProperty(PROPERTY_SELECTION, false);
        m_actionScale->setEnabled(false);
        connect(m_actionSquare, &QAction::triggered, [this](bool)
        {
           emit squarePixelSelected(true);
        });
        connect(m_actionPixel, &QAction::triggered, [this](bool)
        {
           emit squarePixelSelected(false);
        });
        this->connect(m_actionTranslate, SIGNAL(triggered(bool)), this, SLOT(
            on_actionTranslateTriggered(bool)));
        this->connect(m_actionRotate, SIGNAL(triggered(bool)), this, SLOT(
            on_actionRotateTriggered(bool)));
        this->connect(m_actionScale, SIGNAL(triggered(bool)), this, SLOT(
            on_actionScaleTriggered(bool)));
        m_actionPencil = new QAction(QIcon(":/icons/Ressources/pencil.png"), "Pencil");
        m_actionPencil->setProperty(PROPERTY_SELECTION, true);
        this->connect(m_actionPencil, SIGNAL(triggered(bool)), this, SLOT(
            on_actionDrawTriggered(bool)));
        m_actionRectangle = new QAction(QIcon(":/icons/Ressources/rectangle.png"),
            "Rectangle");
        m_actionRectangle->setEnabled(true);
        m_actionRectangle->setProperty(PROPERTY_SELECTION, false);
        this->connect(m_actionRectangle, SIGNAL(triggered(bool)), this, SLOT(
            on_actionDrawTriggered(bool)));
        m_actionPin = new QAction(QIcon(":/icons/Ressources/pin.png"), "Pin of paint");
        m_actionPin->setProperty(PROPERTY_SELECTION, false);
        this->connect(m_actionPin, SIGNAL(triggered(bool)), this, SLOT(
            on_actionDrawTriggered(bool)));
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
        m_actionLayerNone->setProperty(PROPERTY_SELECTION, true);
        m_actionLayerOn = new QAction(QIcon(":/icons/Ressources/layer_on.png"),
            "On top");
        m_actionLayerOn->setProperty(PROPERTY_SELECTION, false);
        bar->addAction(m_actionLayerNone);
        bar->addAction(m_actionLayerOn);
    }

    // Add bar to right corner
    this->setCornerWidget(bar);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::toggleSelection()
{
    int count = this->countSelectionKind();
    int index = static_cast<int>(m_selectionKind);
    QAction *action = nullptr;
    do
    {
        index = Common::modulo(index + 1, count);
        action = actions().at(index);
    } while(!action->isEnabled());
    this->updateSelection(action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSelection(QAction *action)
{
    // Unselect layer on every time you change selection
    this->forceNoneLayer();

    MapEditorSubSelectionKind subSelectionBefore = subSelectionKind();

    // Deselect previous selected action
    actions().at(static_cast<int>(m_selectionKind))->setProperty(PROPERTY_SELECTION,
        false);

    // Select the pressed action
    m_selectionKind = static_cast<MapEditorSelectionKind>(actions().indexOf(
        action));
    action->setProperty(PROPERTY_SELECTION, true);

    // Force none if sprite walls
    MapEditorSubSelectionKind subSelectionAfter = this->subSelectionKind();
    if (subSelectionBefore != subSelectionAfter)
    {
        enableAllRight();
        if (subSelectionAfter == MapEditorSubSelectionKind::SpritesWall ||
            m_selectionKind == MapEditorSelectionKind::Objects3D ||
            m_selectionKind == MapEditorSelectionKind::Mountains ||
            m_selectionKind == MapEditorSelectionKind::None)
        {
            forceNoneLayer();
        } else
        {
            actionLayerOn()->setIcon(QIcon(":/icons/Ressources/layer_on.png"));
        }
        if (m_selectionKind == MapEditorSelectionKind::Sprites ||
            m_selectionKind == MapEditorSelectionKind::Objects3D ||
            m_selectionKind == MapEditorSelectionKind::Mountains ||
            m_selectionKind == MapEditorSelectionKind::None)
        {
            if (subSelectionAfter == MapEditorSubSelectionKind::SpritesWall ||
                m_selectionKind == MapEditorSelectionKind::None)
            {
                this->forcePencil();
            } else
            {
                actionRectangle()->setIcon(QIcon(":/icons/Ressources/rectangle.png"));
                actionRectangle()->setEnabled(true);
                if (this->drawKind() == DrawKind::Pin)
                {
                    this->forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
                }
                actionPin()->setEnabled(false);
                actionPin()->setIcon(QIcon(":/icons/Ressources/pin_disable.png"));
            }
        } else
        {
            actionRectangle()->setIcon(QIcon(":/icons/Ressources/rectangle.png"));
            actionPin()->setIcon(QIcon(":/icons/Ressources/pin.png"));
        }
        if (subSelectionAfter == MapEditorSubSelectionKind::Autotiles ||
            subSelectionAfter == MapEditorSubSelectionKind::SpritesWall ||
            m_selectionKind == MapEditorSelectionKind::Mountains ||
            m_selectionKind == MapEditorSelectionKind::Objects ||
            m_selectionKind == MapEditorSelectionKind::None)
        {
            this->forceNoRotation();
        } else
        {
            this->actionRotate()->setIcon(QIcon(":/icons/Ressources/rotate.png"));
        }
        if (m_selectionKind == MapEditorSelectionKind::Land ||
            subSelectionAfter == MapEditorSubSelectionKind::SpritesWall ||
            m_selectionKind == MapEditorSelectionKind::Mountains ||
            m_selectionKind == MapEditorSelectionKind::Objects ||
            m_selectionKind == MapEditorSelectionKind::None)
        {
            this->forceSquare();
        } else {
            m_actionPixel->setIcon(QIcon(":/icons/Ressources/pixel.png"));
            m_actionTranslate->setEnabled(true);
            m_actionTranslate->setIcon(QIcon(":/icons/Ressources/translate.png"));
            m_actionScale->setEnabled(true);
            m_actionScale->setIcon(QIcon(":/icons/Ressources/scale.png"));
        }
    }

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateMenutext(QMenu *menu, QAction *action)
{
    menu->setTitle(action->text());
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSubSelection(QMenu *menu, QAction
    *menuAction, QAction *action)
{
    this->updateMenutext(menu, action);
    this->updateSelection(menuAction);
    this->enableAllRight();
    MapEditorSubSelectionKind subKind = this->subSelectionKind();
    if (subKind == MapEditorSubSelectionKind::SpritesWall ||
        m_selectionKind == MapEditorSelectionKind::None)
    {
        this->forceNoneLayer();
    } else
    {
        this->actionLayerOn()->setIcon(QIcon(":/icons/Ressources/layer_on.png"));
    }
    if (m_selectionKind == MapEditorSelectionKind::Sprites ||
        m_selectionKind == MapEditorSelectionKind::Objects3D ||
        m_selectionKind == MapEditorSelectionKind::Mountains ||
        m_selectionKind == MapEditorSelectionKind::None)
    {
        if (subKind == MapEditorSubSelectionKind::SpritesWall ||
            m_selectionKind == MapEditorSelectionKind::None)
        {
            this->forcePencil();
        } else
        {
            actionRectangle()->setIcon(QIcon(":/icons/Ressources/rectangle.png"));
            actionRectangle()->setEnabled(true);
            if (this->drawKind() == DrawKind::Pin)
            {
                this->forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
            }
            actionPin()->setEnabled(false);
            actionPin()->setIcon(QIcon(":/icons/Ressources/pin_disable.png"));
        }
    } else {
        this->actionPin()->setIcon(QIcon(":/icons/Ressources/pin.png"));
        actionRectangle()->setIcon(QIcon(":/icons/Ressources/rectangle.png"));
    }
    if (subKind == MapEditorSubSelectionKind::Autotiles || subSelectionKind() ==
        MapEditorSubSelectionKind::SpritesWall || m_selectionKind ==
        MapEditorSelectionKind::Mountains || m_selectionKind ==
        MapEditorSelectionKind::Objects || m_selectionKind == MapEditorSelectionKind::None)
    {
        this->forceNoRotation();
    } else
    {
        this->actionRotate()->setIcon(QIcon(":/icons/Ressources/rotate.png"));
    }
    if (m_selectionKind == MapEditorSelectionKind::Land ||
        subKind == MapEditorSubSelectionKind::SpritesWall ||
        m_selectionKind == MapEditorSelectionKind::Mountains ||
        m_selectionKind == MapEditorSelectionKind::Objects ||
        m_selectionKind == MapEditorSelectionKind::None)
    {
        this->forceSquare();
    } else {
        m_actionPixel->setIcon(QIcon(":/icons/Ressources/pixel.png"));
        m_actionTranslate->setEnabled(true);
        m_actionTranslate->setIcon(QIcon(":/icons/Ressources/translate.png"));
        m_actionScale->setEnabled(true);
        m_actionScale->setIcon(QIcon(":/icons/Ressources/scale.png"));
    }
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateRight(QAction *action)
{
    QList<int> listLeft, listCenter, listRight;
    QList<int> &list = listLeft;
    WidgetMenuBarMapEditor *bar = getBarRight();
    int index = bar->actions().indexOf(action);
    listLeft << static_cast<int>(MapEditorModesKind::Square) <<
                 static_cast<int>(MapEditorModesKind::Pixel);
    listCenter << static_cast<int>(MapEditorModesKind::TransformTranslate) <<
                  static_cast<int>(MapEditorModesKind::TransformRotate) <<
                  static_cast<int>(MapEditorModesKind::TransformScale) <<
                static_cast<int>(MapEditorModesKind::DrawPencil) <<
                  static_cast<int>(MapEditorModesKind::DrawRectangle) <<
                  static_cast<int>(MapEditorModesKind::DrawPin);
    listRight << static_cast<int>(MapEditorModesKind::LayerNone) <<
                 static_cast<int>(MapEditorModesKind::LayerOn);

    // Deselect previous selected action
    if (index >= static_cast<int>(MapEditorModesKind::TransformTranslate))
    {
        if (index >= static_cast<int>(MapEditorModesKind::LayerNone))
        {
            list = listRight;
        } else
        {
            list = listCenter;
        }
    }
    for (int i = 0; i < list.size(); i++)
    {
        bar->actions().at(list.at(i))->setProperty(PROPERTY_SELECTION, false);
    }

    // Select the pressed action
    action->setProperty(PROPERTY_SELECTION, true);

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceSquare()
{
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(static_cast<int>(MapEditorModesKind
        ::Pixel));
    this->forceRight(static_cast<int>(MapEditorModesKind::Square));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/pixel_disable.png"));
    this->forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
    action = bar->actions().at(static_cast<int>(MapEditorModesKind
            ::TransformTranslate));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/translate_disable.png"));
    action = bar->actions().at(static_cast<int>(MapEditorModesKind
            ::TransformScale));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/scale_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::selectSquarePixel(bool square)
{
    this->forceRight(static_cast<int>(square ? MapEditorModesKind::Square :
        MapEditorModesKind::Pixel));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceNoneLayer()
{
    WidgetMenuBarMapEditor *bar = getBarRight();
    QAction *action = bar->actions().at(static_cast<int>(MapEditorModesKind
        ::LayerOn));
    this->forceRight(static_cast<int>(MapEditorModesKind::LayerNone));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/layer_on_disable.png"));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceNoRotation()
{
    WidgetMenuBarMapEditor *bar = getBarRight();
    if (this->drawKind() == DrawKind::Pin && !bar->actions().at(static_cast<int>(
        MapEditorModesKind::DrawPin))->isEnabled())
    {
        this->forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
    }
    QAction *action = bar->actions().at(static_cast<int>(MapEditorModesKind
        ::TransformRotate));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/rotate_disable.png"));
    this->on_actionDrawTriggered(false);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forcePencil()
{
    WidgetMenuBarMapEditor *bar = getBarRight();
    if (this->drawKind() != DrawKind::Pencil)
    {
        this->forceRight(static_cast<int>(MapEditorModesKind::DrawPencil));
    }
    QAction *action = bar->actions().at(static_cast<int>(MapEditorModesKind::DrawPin));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/pin_disable.png"));
    action = bar->actions().at(static_cast<int>(MapEditorModesKind::DrawRectangle));
    action->setEnabled(false);
    action->setIcon(QIcon(":/icons/Ressources/rectangle_disable.png"));
    this->on_actionDrawTriggered(false);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::forceRight(int i)
{
    this->updateRight(this->getBarRight()->actions().at(i));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::enableAllRight()
{
    m_actionSquare->setEnabled(true);
    m_actionPixel->setEnabled(true);
    m_actionTranslate->setEnabled(true);
    m_actionRotate->setEnabled(true);
    m_actionScale->setEnabled(true);
    m_actionPencil->setEnabled(true);
    m_actionRectangle->setEnabled(true);
    m_actionPin->setEnabled(true);
    m_actionLayerNone->setEnabled(true);
    m_actionLayerOn->setEnabled(true);
}

//-------------------------------------------------

void WidgetMenuBarMapEditor::setDetection()
{
    for (int i = 0, l = this->actions().size(); i < l; ++i)
    {
        this->actions().at(i)->setVisible(false);
    }
    this->repaint();
}

//-------------------------------------------------

void WidgetMenuBarMapEditor::translate()
{
    ui->menuEvents->setTitle(RPM::translate(Translations::OBJECT));
    ui->menuFloors->setTitle(RPM::translate(Translations::FLOOR));
    ui->menuMountain->setTitle(RPM::translate(Translations::MOUNTAIN));
    ui->menu3D_object->setTitle(RPM::translate(Translations::THREED_OBJECT));
    ui->menuFace_Sprite->setTitle(RPM::translate(Translations::FACE_SPRITE));
    ui->menuView->setTitle(RPM::translate(Translations::VIEW));
    ui->actionSlope->setText(RPM::translate(Translations::SLOPE));
    ui->actionFloors->setText(RPM::translate(Translations::FLOOR));
    ui->actionObject->setText(RPM::translate(Translations::OBJECT));
    ui->actionAutotile->setText(RPM::translate(Translations::AUTOTILE));
    ui->actionMountain->setText(RPM::translate(Translations::MOUNTAIN));
    ui->action3D_object->setText(RPM::translate(Translations::THREED_OBJECT));
    ui->actionFix_Sprite->setText(RPM::translate(Translations::FIX_SPRITE));
    ui->actionFace_Sprite->setText(RPM::translate(Translations::FACE_SPRITE));
    ui->actionWall_Sprite->setText(RPM::translate(Translations::WALL));
    ui->actionDouble_Sprite->setText(RPM::translate(Translations::DOUBLE_SPRITE));
    ui->actionQuadra_Sprite->setText(RPM::translate(Translations::QUADRA_SPRITE));
    ui->actionAnimated_Autotile->setText(RPM::translate(Translations::ANIMATED_AUTOTILE));
    ui->actionView->setText(RPM::translate(Translations::VIEW));
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::mouseMoveEvent(QMouseEvent *event)
{
    this->setActiveAction(this->actionAt(event->pos()));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::mousePressEvent(QMouseEvent *event)
{
    QAction *action = this->actionAt(event->pos());
    if (m_selection)
    {
        if (action != nullptr && action->isEnabled())
        {
            this->updateSelection(action);
            emit selectionChanged();
        }
    } else
    {
        if (action != nullptr && action->text() != "|" && action->isEnabled())
        {
            this->updateRight(action);
        }
    }
    QMenuBar::mousePressEvent(event);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::paintEvent(QPaintEvent *e)
{
    QPainter p(this);

    // Draw the items
    QAction *action;
    QRect adjustedActionRect;
    for (int i = 0, l = this->actions().size(); i < l; ++i)
    {
        action = this->actions().at(i);
        if (!action->isVisible())
        {
            continue;
        }
        adjustedActionRect = this->actionGeometry(action);

        // Fill by the magic color the selected item
        if (action->property(PROPERTY_SELECTION) == true)
        {
            if (m_selection)
            {
                p.fillRect(adjustedActionRect, COLOR_BACKGROUND_SELECTED);
            } else
            {
                p.fillRect(adjustedActionRect, RPM::get()->engineSettings()
                    ->theme() == ThemeKind::Dark ? COLOR_BACKGROUND_RIGHT_SELECTED :
                    Qt::lightGray);
            }
        }

        // Draw all the other stuff (text, special background..)
        if (adjustedActionRect.isEmpty() || !action->isVisible())
        {
            continue;
        }
        if (!e->rect().intersects(adjustedActionRect))
        {
            continue;
        }

        QStyleOptionMenuItem opt;
        this->initStyleOption(&opt, action);
        opt.rect = adjustedActionRect;

        // Drawing separator and disabled with darker color
        if (opt.icon.isNull())
        {
            if (action->text() == "|" || !action->isEnabled())
            {
                p.setPen(QColor(100, 100, 100));
            } else
            {
                p.setPen(RPM::get()->engineSettings()->theme() == ThemeKind::Dark
                    || action->property(PROPERTY_SELECTION) == true ? Qt::white :
                    Qt::black);
            }
            p.drawText(adjustedActionRect, action->text(), QTextOption(Qt::AlignCenter));
            opt.text = "";
        }
        this->style()->drawControl(QStyle::CE_MenuBarItem, &opt, &p, this);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFloors_triggered(QAction *action)
{
    this->updateSubSelection(ui->menuFloors, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Land)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFace_Sprite_triggered(QAction *action)
{
    this->updateSubSelection(ui->menuFace_Sprite, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Sprites)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuMountain_triggered(QAction *action)
{
    this->updateSubSelection(ui->menuMountain, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Mountains)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menu3D_object_triggered(QAction *action)
{
    this->updateSubSelection(ui->menu3D_object, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Objects3D)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuEvents_triggered(QAction *action)
{
    this->updateSubSelection(ui->menuEvents, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::Objects)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuView_triggered(QAction *action)
{
    this->updateSubSelection(ui->menuView, this->actions().at(static_cast<int>(
        MapEditorSelectionKind::None)), action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_actionTranslateTriggered(bool)
{
    MainWindow::get()->panelTextures()->showTransformations(DrawKind::Translate);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_actionRotateTriggered(bool)
{
    MainWindow::get()->panelTextures()->showTransformations(DrawKind::Rotate);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_actionScaleTriggered(bool)
{
    MainWindow::get()->panelTextures()->showTransformations(DrawKind::Scale);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_actionDrawTriggered(bool)
{
    MainWindow::get()->panelTextures()->updateShow();
}
