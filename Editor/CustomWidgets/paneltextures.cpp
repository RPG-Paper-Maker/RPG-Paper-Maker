/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "paneltextures.h"
#include "ui_paneltextures.h"
#include "systemspritewall.h"
#include "rpm.h"
#include "dialogtilesetspecialelements.h"
#include "widgettreelocalmaps.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelTextures::PanelTextures(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTextures),
    m_widgetTreeLocalMaps(nullptr),
    m_kind(PictureKind::None),
    m_drawKind(DrawKind::Pencil),
    m_currentAutotilesID(-1),
    m_currentWallsID(-1),
    m_currentMountainID(-1),
    m_currentObjects3DID(-1)
{
    ui->setupUi(this);

    this->translate();
}

PanelTextures::~PanelTextures() {
    delete ui;
}

PanelTransformations * PanelTextures::panelTransformations() const {
    return ui->panelTransformations;
}

void PanelTextures::setDrawKind(DrawKind dk) {
    m_drawKind = dk;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelTextures::initializeWidgetTreeLocalMaps(WidgetTreeLocalMaps *w) {
    m_widgetTreeLocalMaps = w;
}

// -------------------------------------------------------

void PanelTextures::getTilesetTexture(QRect &rect) const{
    switch (m_kind) {
    case PictureKind::Autotiles:
        ui->widgetAutotilesSelector->currentTexture(rect); break;
    default:
        ui->widgetTilesetSelector->currentTexture(rect);
    }
}

// -------------------------------------------------------

void PanelTextures::setTilesetImage(QString path) {
    ui->widgetTilesetSelector->setImage(path);
    updateTilesetImage();
}

// -------------------------------------------------------

void PanelTextures::setTilesetImageNone() {
    ui->widgetTilesetSelector->setImageNone();
    hideAll();
    updateTilesetImage();
}

// -------------------------------------------------------

void PanelTextures::updateTilesetImage() {
    if (m_drawKind != DrawKind::Translate && m_drawKind != DrawKind::Rotate &&
        m_drawKind != DrawKind::Scale)
    {
        this->setGeometry(0, 0, ui->widgetTilesetSelector->width(), ui
            ->widgetTilesetSelector->height());
        setFixedSize(ui->widgetTilesetSelector->width(), ui
            ->widgetTilesetSelector->height());
    }
}

// -------------------------------------------------------

void PanelTextures::hideAll() {
    ui->widgetTilesetSelector->hide();
    ui->widgetAutotilesSelector->hide();
    ui->widgetWallPreview->hide();
    ui->widgetMountainPreview->hide();
    ui->widget3DObjectPreview->hide();
    ui->panelTransformations->hide();
    ui->panelTransformations->deletePosition();
    ui->comboBox->hide();
    ui->pushButtonUpdateList->hide();
    ui->labelInformation->hide();
}

// -------------------------------------------------------

void PanelTextures::showTileset() {
    m_kind = PictureKind::None;

    if (m_drawKind == DrawKind::Rotate) {
        this->showTransformations();
    } else {
        hideAll();
        ui->widgetTilesetSelector->show();
        this->updateTilesetImage();
        this->updateWallsSize();
        this->updateMountainsSize();
        this->updateObject3DSize();
    }
}

// -------------------------------------------------------

int PanelTextures::getID() const {
    return m_kind == PictureKind::None ? -1 :SuperListItem::getIdByIndex(RPM
        ::get()->project()->currentMap()->mapProperties()->tileset()->model(
        m_kind), ui->comboBox->currentIndex());
}

// -------------------------------------------------------

int PanelTextures::getWidthSquares() const {
    return ui->widgetMountainPreview->getWidthSquares();
}

// -------------------------------------------------------

double PanelTextures::getWidthPixels() const {
    return ui->widgetMountainPreview->getWidthPixels();
}

// -------------------------------------------------------

int PanelTextures::getHeightSquares() const {
    return ui->widgetMountainPreview->getHeightSquares();
}

// -------------------------------------------------------

double PanelTextures::getHeightPixels() const {
    return ui->widgetMountainPreview->getHeightPixels();
}

// -------------------------------------------------------

void PanelTextures::getDefaultFloorRect(QRect& rect) const {
    ui->widgetMountainPreview->getDefaultFloorRect(rect);
}

// -------------------------------------------------------

QWidget * PanelTextures::getSpecialWidget() const {
    if (m_drawKind == DrawKind::Translate || m_drawKind == DrawKind::Rotate ||
        m_drawKind == DrawKind::Scale)
    {
        return ui->panelTransformations;
    } else {
        switch (m_kind) {
        case PictureKind::Autotiles:
            return ui->widgetAutotilesSelector;
        case PictureKind::Walls:
            return ui->widgetWallPreview;
        case PictureKind::Mountains:
            return ui->widgetMountainPreview;
        case PictureKind::Object3D:
            return ui->widget3DObjectPreview;
        default:
            return ui->widgetTilesetSelector;
        }
    }
}

// -------------------------------------------------------

void PanelTextures::showComboBox() {
    updateComboBoxSize();
    ui->pushButtonUpdateList->show();

    // Setting label text
    if (ui->comboBox->count() == 0) {
        ui->labelInformation->show();
        ui->labelInformation->setText(createlabelText());
        updateLabelSize();
        ui->comboBox->hide();
    } else {
        ui->labelInformation->hide();
        ui->comboBox->show();
        showWidgetSpecial();
    }
}

// -------------------------------------------------------

void PanelTextures::showWidgetSpecial() {
    switch (m_kind) {
    case PictureKind::Autotiles:
        ui->widgetAutotilesSelector->show();
        break;
    case PictureKind::Walls:
        ui->widgetWallPreview->show();
        break;
    case PictureKind::Mountains:
        ui->widgetMountainPreview->show();
        break;
    case PictureKind::Object3D:
        ui->widget3DObjectPreview->show();
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelTextures::updateComboBoxSize() {
    ui->comboBox->setGeometry(0, 0, this->parentWidget()->width(), ui->comboBox
        ->height());
    ui->comboBox->setFixedSize(this->parentWidget()->width(), ui->comboBox
        ->height());
    ui->pushButtonUpdateList->setGeometry(0, 0, this->parentWidget()->width(),
        ui->pushButtonUpdateList->height());
    ui->pushButtonUpdateList->setFixedSize(this->parentWidget()->width(), ui
        ->pushButtonUpdateList->height());

    this->updateWidgetSize();

    // Update object3D previewer size
    this->updateWallsSize();
    this->updateMountainsSize();
    this->updateObject3DSize();
}

// -------------------------------------------------------

void PanelTextures::updateLabelSize() {
    ui->labelInformation->setGeometry(0, 0, this->parentWidget()->width(), this
        ->parentWidget()->height());
    ui->labelInformation->setFixedSize(this->parentWidget()->width(), this
        ->parentWidget()->height());
    this->setGeometry(0, 0, this->parentWidget()->width(), this->parentWidget()
        ->height());
    setFixedSize(this->parentWidget()->width(), this->parentWidget()->height());
}

// -------------------------------------------------------

void PanelTextures::updateWidgetSize() {
    QWidget *currentSpecial;
    int width, height;

    currentSpecial = this->getSpecialWidget();
    width = qMax(currentSpecial->width(), this->parentWidget()->width());
    height = ui->comboBox->height() + + ui->pushButtonUpdateList->height() +
        12 + currentSpecial->height();
    this->setGeometry(0, 0, width, height);
    this->setFixedSize(width, height);
}

// -------------------------------------------------------

QString PanelTextures::createlabelText() {
    QString kindText = "";
    switch (m_kind) {
    case PictureKind::Autotiles:
        kindText = "autotile";
        break;
    case PictureKind::Walls:
        kindText = "wall";
        break;
    case PictureKind::Mountains:
        kindText = "mountain";
        break;
    case PictureKind::Object3D:
        kindText = "3D object";
        break;
    default:
        break;
    }

    return "You don't have any " + kindText + " in this tileset. You can add "
        "it thanks to the button update list here or in the tileset tab in the "
        "datas manager.";
}

// -------------------------------------------------------

void PanelTextures::showAutotiles(SystemTileset *tileset) {
    m_tileset = tileset;
    tileset->updateModelAutotiles();
    fillComboBox(tileset, PictureKind::Autotiles);
}

// -------------------------------------------------------

void PanelTextures::showSpriteWalls(SystemTileset *tileset) {
    m_tileset = tileset;
    tileset->updateModelSpriteWalls();
    fillComboBox(tileset, PictureKind::Walls);
}

// -------------------------------------------------------

void PanelTextures::showMountains(SystemTileset *tileset) {
    m_tileset = tileset;
    tileset->updateModelMountains();
    fillComboBox(tileset, PictureKind::Mountains);
    ui->widgetMountainPreview->initializeTilesetPictureID(tileset->pictureID());
}

// -------------------------------------------------------

void PanelTextures::showObjects3D(SystemTileset *tileset) {
    m_kind = PictureKind::Object3D;

    if (m_drawKind == DrawKind::Rotate) {
        this->showTransformations();
    } else {
        m_tileset = tileset;
        tileset->updateModel3DObjects();
        fillComboBox(tileset, PictureKind::Object3D);
        this->updateWidgetSize();
    }
}

// -------------------------------------------------------

void PanelTextures::showTransformations() {
    int width, height;

    m_drawKind = DrawKind::Rotate;
    this->hideAll();
    ui->panelTransformations->show();
    width = qMax(ui->panelTransformations->width(), this->parentWidget()
        ->width());
    this->setFixedSize(width, this->parentWidget()->height());
    this->updateGeometry();
    height = ui->panelTransformations->height();
    this->setGeometry(0, 0, width, height);
    this->setFixedSize(width, height);
}

// -------------------------------------------------------

void PanelTextures::fillComboBox(SystemTileset *tileset, PictureKind kind) {
    m_kind = kind;

    QStandardItemModel *model = tileset->model(kind);
    QStandardItemModel *modelComplete = RPM::get()->project()
        ->specialElementsDatas()->model(kind);

    // ComboBox filling
    ui->comboBox->clear();
    SuperListItem::fillComboBox(ui->comboBox, model);
    for (int i = 0; i < ui->comboBox->count(); i++) {
        SuperListItem *super = reinterpret_cast<SuperListItem *>(model->item(i)
            ->data().value<quintptr>());
        SystemSpecialElement *special = reinterpret_cast<SystemSpecialElement *>
            (SuperListItem::getById(modelComplete->invisibleRootItem(), super
            ->id(), false));
        ui->comboBox->setItemIcon(i, QIcon(special == nullptr ? RPM
            ::PATH_TEXTURE_MISSING : special->picture()->getPath(m_kind)));
    }

    // Select current ID
    int index = SuperListItem::getIndexById(model->invisibleRootItem(), this
        ->getCurrentID());
    if (index > 0) {
        ui->comboBox->setCurrentIndex(index);
    }

    // UI display
    hideAll();
    showComboBox();
}

// -------------------------------------------------------

void PanelTextures::updateWallsSize() {
    if (m_kind == PictureKind::Walls) {
        int w, h;

        w = qMax(ui->comboBox->width(), ui->widgetWallPreview->width());
        h = ui->comboBox->height() + ui->pushButtonUpdateList->height() +
            ui->widgetWallPreview->height() + 18;
        ui->widgetWallPreview->setGeometry(0, 0, w, ui->widgetWallPreview
            ->height());
        this->setGeometry(0, 0, w, h);
        this->setFixedSize(w, h);
    }
}

// -------------------------------------------------------

void PanelTextures::updateMountainsSize() {
    if (m_kind == PictureKind::Mountains) {
        int w, h;

        w = ui->comboBox->width();
        h = ui->comboBox->height() + ui->pushButtonUpdateList->height() +
            ui->widgetMountainPreview->height() + 18;
        ui->widgetMountainPreview->setGeometry(0, 0, w, ui
            ->widgetMountainPreview->height());
        this->setGeometry(0, 0, w, h);
        this->setFixedSize(w, h);
    }
}

// -------------------------------------------------------

void PanelTextures::updateObject3DSize() {
    int w;

    w = ui->comboBox->width();
    ui->widget3DObjectPreview->setGeometry(0, 0, w, w);
    ui->widget3DObjectPreview->setFixedSize(w, w);
}

// -------------------------------------------------------

int PanelTextures::getCurrentID() const {
    switch (m_kind) {
    case PictureKind::Autotiles:
        return m_currentAutotilesID;
    case PictureKind::Walls:
        return m_currentWallsID;
    case PictureKind::Mountains:
        return m_currentMountainID;
    case PictureKind::Object3D:
        return m_currentObjects3DID;
    default:
        return -1;
    }
}

// -------------------------------------------------------

void PanelTextures::updateCurrentID(int id) {
    switch (m_kind) {
    case PictureKind::Autotiles:
        m_currentAutotilesID = id;
        break;
    case PictureKind::Walls:
        m_currentWallsID = id;
        break;
    case PictureKind::Mountains:
        m_currentMountainID = id;
        break;
    case PictureKind::Object3D:
        m_currentObjects3DID = id;
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelTextures::updateImageSpecial(SystemSpecialElement *special)
{
    switch (m_kind) {
    case PictureKind::Autotiles:
        ui->widgetAutotilesSelector->setImage(reinterpret_cast<SystemAutotile *>
            (special));
        break;
    case PictureKind::Walls:
        ui->widgetWallPreview->updatePicture(special->picture(), m_kind);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelTextures::updateShow() {
    switch (m_kind) {
    case PictureKind::Autotiles:
        this->showAutotiles(m_tileset);
        break;
    case PictureKind::Walls:
        this->showSpriteWalls(m_tileset);
        break;
    case PictureKind::Mountains:
        this->showMountains(m_tileset);
        break;
    case PictureKind::Object3D:
        this->showObjects3D(m_tileset);
        break;
    default:
        this->showTileset();
        break;
    }
}

//-------------------------------------------------

void PanelTextures::translate()
{

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelTextures::onSplitterMoved(int, int) {
    if (m_drawKind == DrawKind::Translate || m_drawKind == DrawKind::Rotate ||
        m_drawKind == DrawKind::Scale)
    {
        if (m_kind == PictureKind::None)
            updateTilesetImage();
        else {
            if (ui->comboBox->count() == 0)
                updateLabelSize();
            else
                updateComboBoxSize();
        }
    } else {
        this->showTransformations();
    }
}

// -------------------------------------------------------

void PanelTextures::on_comboBox_currentIndexChanged(int) {
    int id;

    id = getID();

    // Update index selection
    if (ui->comboBox->count() > 1) {
        updateCurrentID(id);
    }

    // Update picture preview
    SystemSpecialElement* special = reinterpret_cast<SystemSpecialElement *>(
        SuperListItem::getById(RPM::get()->project()->specialElementsDatas()
        ->model(m_kind)->invisibleRootItem(), id));

    // Updating image on preview
    updateImageSpecial(special);

    // Object previewer
    if (m_kind == PictureKind::Object3D) {
        ui->widget3DObjectPreview->loadObject(reinterpret_cast<SystemObject3D *>
            (special));
        ui->widget3DObjectPreview->updateObject();
    }

    // Update size according to widget size
    this->updateWidgetSize();
}

// -------------------------------------------------------

void PanelTextures::on_pushButtonUpdateList_pressed() {
    int tilesetID;

    tilesetID = m_tileset->id();
    DialogTilesetSpecialElements dialog(m_tileset, m_kind);
    if (dialog.exec() == QDialog::Accepted) {
        RPM::get()->project()->writePicturesDatas();
        RPM::get()->project()->writeSpecialsDatas();
        RPM::get()->project()->writeTilesetsDatas();
        RPM::get()->project()->writeShapesDatas();
        this->fillComboBox(m_tileset, m_kind);
    } else {
        RPM::get()->project()->readPicturesDatas();
        RPM::get()->project()->readSpecialsDatas();
        RPM::get()->project()->readTilesetsDatas();
        RPM::get()->project()->readShapesDatas();
        m_tileset = reinterpret_cast<SystemTileset *>(SuperListItem::getById(RPM
            ::get()->project()->gameDatas()->tilesetsDatas()->model()
            ->invisibleRootItem(), tilesetID));
    }
    m_widgetTreeLocalMaps->reload();
}
