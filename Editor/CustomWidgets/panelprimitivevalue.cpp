/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelprimitivevalue.h"
#include "ui_panelprimitivevalue.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPrimitiveValue::PanelPrimitiveValue(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPrimitiveValue),
    m_model(new PrimitiveValue),
    m_modelNeedDelete(true)
{
    ui->setupUi(this);

    ui->comboBoxChoice->setMaxVisibleItems(12);
    ui->comboBoxChoice->setStyleSheet("combobox-popup: 0;");
    Q_FOREACH(QSpinBox * sp, findChildren<QSpinBox*>()) {
        sp->installEventFilter(this);
    }
    Q_FOREACH(QDoubleSpinBox * sp, findChildren<QDoubleSpinBox*>()) {
        sp->installEventFilter(this);
    }
    Q_FOREACH(QComboBox * sp, findChildren<QComboBox*>()) {
        sp->installEventFilter(this);
    }

    this->translate();
}

PanelPrimitiveValue::~PanelPrimitiveValue()
{
    if (m_modelNeedDelete) {
        delete m_model;
    }

    delete ui;
}

QSpinBox * PanelPrimitiveValue::spinBoxNumber() const {
    return ui->spinBoxNumber;
}

QDoubleSpinBox * PanelPrimitiveValue::doubleSpinBoxNumber() const {
    return ui->doubleSpinBoxNumber;
}

PrimitiveValue * PanelPrimitiveValue::model() const {
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPrimitiveValue::updateModel() {
    updateValue(true);
    updateKind();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializePrimitives() {
    m_kind = PanelPrimitiveValueKind::Primitives;
    addAnything();
    addNone();
    addNumber();
    addMessage(false);
    addSwitch();
    addKeyBoard();
    setNumberValue(m_model->numberValue());
    setMessageValue(m_model->messageValue());
    setSwitchValue(m_model->switchValue());
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeParameterEvent(QStandardItemModel
    *properties, QStandardItemModel *parameters)
{
    m_kind = PanelPrimitiveValueKind::ParameterEvent;
    this->addDefault();
    this->addAnything();
    this->addNone();
    this->addNumberDouble();
    this->addVariable();
    this->addMessage(false);
    this->addSwitch();
    this->addKeyBoard();
    this->addProperty(properties);
    this->addParameter(parameters);
    this->setNumberDoubleValue(m_model->numberDoubleValue());
    this->setMessageValue(m_model->messageValue());
    this->setSwitchValue(m_model->switchValue());
    this->initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeNumberVariable() {
    m_kind = PanelPrimitiveValueKind::ConstantVariable;
    addNumber();
    addVariable();
    initialize();
    showNumber();
    setNumberValue(m_model->numberValue());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeNumber(QStandardItemModel *parameters,
    QStandardItemModel *properties, bool isInteger)
{
    m_kind = PanelPrimitiveValueKind::Number;
    addParameter(parameters);
    addProperty(properties);
    if (isInteger)
        addNumber();
    else
        addNumberDouble();
    addVariable();
    initialize();

    if (isInteger) {
        showNumber();
        setNumberValue(m_model->numberValue());
    } else {
        showNumberDouble();
        setNumberDoubleValue(m_model->numberDoubleValue());
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeDataBaseCommandId(QStandardItemModel
    *dataBase, QStandardItemModel *parameters, QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::DataBaseCommandId;
    addDataBase(dataBase);
    addParameter(parameters);
    addProperty(properties);
    addNumber();
    addVariable();
    initialize();
    if (dataBase != nullptr && dataBase->invisibleRootItem()->rowCount() > 0)
        showDataBase();
    else
        showNumber();
    setNumberValue(m_model->numberValue());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeMessage(bool formula, QStandardItemModel
    *parameters, QStandardItemModel *properties, bool showPrimitive)
{
    m_kind = PanelPrimitiveValueKind::Message;
    addParameter(parameters);
    addProperty(properties);
    if (showPrimitive) {
        addMessage(formula);
    }
    addVariable();
    initialize();
    showMessage();
    setMessageValue(m_model->messageValue());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeSwitch(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::Switch;
    addParameter(parameters);
    addProperty(properties);
    addSwitch();
    addVariable();
    initialize();

    showSwitch();
    setSwitchValue(m_model->switchValue());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeProperty(QStandardItemModel *parameters,
    QStandardItemModel *properties, bool isInteger)
{
    m_kind = PanelPrimitiveValueKind::Property;
    addNone();
    if (isInteger) {
        addNumber();
    } else {
        addNumberDouble();
    }
    addVariable();
    addMessage(false);
    addSwitch();
    addKeyBoard();
    addParameter(parameters);
    addProperty(properties);
    if (isInteger) {
        setNumberValue(m_model->numberValue());
    } else {
        setNumberDoubleValue(m_model->numberDoubleValue());
    }
    setMessageValue(m_model->messageValue());
    setSwitchValue(m_model->switchValue());
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeVariableParamProp(QStandardItemModel
    *parameters, QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::VariableParamProp;
    this->addVariable();
    this->addParameter(parameters);
    this->addProperty(properties);
    setNumberValue(m_model->numberValue());
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeFont(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::Font;
    addFont();
    addParameter(parameters);
    addProperty(properties);
    addMessage(false);
    addVariable();
    setMessageValue(m_model->messageValue());
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeAll(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::All;
    this->addCustomStructure(false);
    this->addCustomStructure(true);
    addVariable();
    addNumberDouble();
    addSwitch();
    addMessage(false);
    addParameter(parameters);
    addProperty(properties);
    addDataBase(RPM::get()->project()->gameDatas()->classesDatas()->model(),
        PrimitiveValueKind::Class);
    addDataBase(RPM::get()->project()->gameDatas()->heroesDatas()->model(),
        PrimitiveValueKind::Hero);
    addDataBase(RPM::get()->project()->gameDatas()->monstersDatas()->model(),
        PrimitiveValueKind::Monster);
    addDataBase(RPM::get()->project()->gameDatas()->troopsDatas()->model(),
        PrimitiveValueKind::Troop);
    addDataBase(RPM::get()->project()->gameDatas()->itemsDatas()->model(),
        PrimitiveValueKind::Item);
    addDataBase(RPM::get()->project()->gameDatas()->weaponsDatas()->model(),
        PrimitiveValueKind::Weapon);
    addDataBase(RPM::get()->project()->gameDatas()->armorsDatas()->model(),
        PrimitiveValueKind::Armor);
    addDataBase(RPM::get()->project()->gameDatas()->skillsDatas()->model(),
        PrimitiveValueKind::Skill);
    addDataBase(RPM::get()->project()->gameDatas()->animationsDatas()->model(),
        PrimitiveValueKind::Animation);
    /*
    addDataBase(RPM::get()->project()->gameDatas()->statusDatas()->model(),
        PrimitiveValueKind::Statu);*/
    addDataBase(RPM::get()->project()->gameDatas()->tilesetsDatas()->model(),
        PrimitiveValueKind::Tileset);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelFontSizes(), PrimitiveValueKind::FontSize);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelFontNames(), PrimitiveValueKind::FontName);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelColors()
        , PrimitiveValueKind::Color);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelWindowSkins(), PrimitiveValueKind::WindowSkin);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelCurrencies(), PrimitiveValueKind::Currency);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelSpeed(),
        PrimitiveValueKind::Speed);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelDetections(), PrimitiveValueKind::Detection);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelcameraProperties(), PrimitiveValueKind::CameraProperty);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelFrequencies(), PrimitiveValueKind::Frequency);
    addDataBase(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelSkyBoxes(), PrimitiveValueKind::Skybox);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelBattleMaps(), PrimitiveValueKind::BattleMap);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelElements(), PrimitiveValueKind::Element);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelCommonStatistics(), PrimitiveValueKind::CommonStatistic);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelWeaponsKind(), PrimitiveValueKind::WeaponsKind);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelArmorsKind(), PrimitiveValueKind::ArmorsKind);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelCommonBattleCommand(), PrimitiveValueKind::CommonBattleCommand);
    addDataBase(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelCommonEquipment(), PrimitiveValueKind::CommonEquipment);
    addDataBase(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelEventsUser(), PrimitiveValueKind::Event);
    addDataBase(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelStates(), PrimitiveValueKind::State);
    addDataBase(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonReactors(), PrimitiveValueKind::CommonReaction);
    addDataBase(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonObjects(), PrimitiveValueKind::Model);
    setNumberValue(m_model->numberValue());
    setNumberDoubleValue(m_model->numberDoubleValue());
    setSwitchValue(m_model->switchValue());
    setMessageValue(m_model->messageValue());
    ui->comboBoxChoice->setFixedWidth(200);
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initialize() {
    hideAll();
    connect(ui->comboBoxChoice, SIGNAL(currentIndexChanged(int)), this, SLOT(
        on_comboBoxChoiceCurrentIndexChanged(int)));
    setKind(m_model->kind());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeModel(PrimitiveValue *m) {
    if (m_modelNeedDelete) {
        delete m_model;
    }
    m_model = m;
    m_modelNeedDelete = false;
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeNumberAndUpdate(PrimitiveValue *m, bool
    isInteger)
{
    initializeNumber(m->modelParameter(), m->modelProperties(), isInteger);
    initializeModel(m);
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeNumberVariableAndUpdate(PrimitiveValue *m)
{
    initializeNumberVariable();
    initializeModel(m);
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeDataBaseAndUpdate(PrimitiveValue *m)
{
    initializeDataBaseCommandId(m->modelDataBase());
    initializeModel(m);
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeMessageAndUpdate(PrimitiveValue *m, bool
    formula)
{
    initializeMessage(formula);
    initializeModel(m);
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializePropertyAndUpdate(PrimitiveValue *m,
    QStandardItemModel *parameters, QStandardItemModel *properties)
{
    initializeModel(m);
    initializeProperty(parameters, properties);
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeFontAndUpdate(PrimitiveValue *m) {
    initializeModel(m);
    initializeFont();
    updateModel();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeAllAndUpdate(PrimitiveValue *m)
{
    initializeModel(m);
    initializeAll(m_model->modelParameter(), m_model->modelProperties());
    updateModel();
    switch (m->kind())
    {
    case PrimitiveValueKind::CustomStructure:
        this->showCustomStructure(false);
        break;
    case PrimitiveValueKind::CustomList:
        this->showCustomStructure(true);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::setKind(PrimitiveValueKind kind) {
    m_model->setKind(kind);
    ui->comboBoxChoice->setCurrentIndex(getKindIndex(kind));
    updateValue();
}

// -------------------------------------------------------

void PanelPrimitiveValue::setNumberValue(int n) {
    m_model->setNumberValue(n);

    switch(m_model->kind()) {
    case PrimitiveValueKind::Number:
        ui->spinBoxNumber->setValue(n); break;
    case PrimitiveValueKind::Variable:
        ui->widgetVariable->setCurrentId(n); break;
    case PrimitiveValueKind::Parameter:
        ui->comboBoxParameter->setCurrentIndex(SuperListItem::getIndexById(
            m_model->modelParameter()->invisibleRootItem(), n));
        break;
    case PrimitiveValueKind::Property:
        ui->comboBoxProperty->setCurrentIndex(SuperListItem::getIndexById(
            m_model->modelProperties()->invisibleRootItem(), n));
        break;
    case PrimitiveValueKind::DataBase:
        ui->comboBoxDataBase->setCurrentIndex(SuperListItem::getIndexById(
            m_model->modelDataBase()->invisibleRootItem(), n));
        break;
    case PrimitiveValueKind::KeyBoard:
        ui->comboBoxKeyBoard->setCurrentIndex(SuperListItem::getIndexById(
            RPM::get()->project()->keyBoardDatas()->model()
            ->invisibleRootItem(), n));
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::setNumberDoubleValue(double n) {
    m_model->setNumberDoubleValue(n);
    ui->doubleSpinBoxNumber->setValue(n);
}

// -------------------------------------------------------

void PanelPrimitiveValue::setMessageValue(QString m) {
    m_model->setMessageValue(m);

    switch(m_model->kind()) {
    case PrimitiveValueKind::Message:
        ui->lineEditMessage->setText(m); break;
    case PrimitiveValueKind::Script:
        ui->lineEditScript->setText(m); break;
    case PrimitiveValueKind::Font:
    {
        QFont font(m);
        ui->fontComboBox->setCurrentFont(font);
        break;
    }
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::setSwitchValue(bool s) {
    m_model->setSwitchValue(s);
    ui->comboBoxSwitch->setCurrentIndex(s ? 0 : 1);
}

// -------------------------------------------------------

void PanelPrimitiveValue::updateValue(bool update) {
    switch(m_model->kind()) {
    case PrimitiveValueKind::None:
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
        break;
    case PrimitiveValueKind::Number:
        setNumberValue(update ? m_model->numberValue() : ui->spinBoxNumber->
            value());
        break;
    case PrimitiveValueKind::Variable:
        setNumberValue(update ? m_model->numberValue() : ui->widgetVariable
            ->currentId());
        break;
    case PrimitiveValueKind::Parameter:
        setNumberValue(update ? m_model->numberValue() :
            SuperListItem::getIdByIndex(m_model->modelParameter(), ui
            ->comboBoxParameter->currentIndex()));
        break;
    case PrimitiveValueKind::Property:
        setNumberValue(update ? m_model->numberValue() :
            SuperListItem::getIdByIndex(m_model->modelProperties(), ui
            ->comboBoxProperty->currentIndex()));
        break;
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
        setNumberValue(update ? m_model->numberValue() :
            SuperListItem::getIdByIndex(m_model->modelDataBase(), ui
            ->comboBoxDataBase->currentIndex()));
        break;
    case PrimitiveValueKind::Message:
        setMessageValue(update ? m_model->messageValue() : ui->lineEditMessage
            ->text());
        break;
    case PrimitiveValueKind::Script:
        setMessageValue(update ? m_model->messageValue() : ui->lineEditScript
            ->text());
        break;
    case PrimitiveValueKind::Switch:
        setSwitchValue(update ? m_model->switchValue() : ui->comboBoxSwitch
            ->currentIndex() == 0);
        break;
    case PrimitiveValueKind::KeyBoard:
        setNumberValue(update ? m_model->numberValue() : SuperListItem
            ::getIdByIndex(RPM::get()->project()->keyBoardDatas()->model(),
            ui->comboBoxKeyBoard->currentIndex()));
        break;
    case PrimitiveValueKind::NumberDouble:
        setNumberDoubleValue(update ? m_model->numberDoubleValue() : ui
            ->doubleSpinBoxNumber->value());
        break;
    case PrimitiveValueKind::Font:
        setMessageValue(update ? m_model->messageValue() : ui->fontComboBox
            ->currentText());
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::updateKind(bool update) {
    if (update) {
        m_model->setKind(static_cast<PrimitiveValueKind>(ui->comboBoxChoice
            ->currentData().value<int>()));
    } else {
        setKind(m_model->kind());
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::sync() {
    updateValue(true);
    ui->comboBoxChoice->setCurrentIndex(getKindIndex(m_model->kind()));
}

// -------------------------------------------------------

void PanelPrimitiveValue::hideAll() {
    ui->spinBoxNumber->hide();
    ui->widgetVariable->hide();
    ui->comboBoxParameter->hide();
    ui->comboBoxProperty->hide();
    ui->comboBoxDataBase->hide();
    ui->lineEditMessage->hide();
    ui->lineEditScript->hide();
    ui->comboBoxSwitch->hide();
    ui->comboBoxKeyBoard->hide();
    ui->doubleSpinBoxNumber->hide();
    ui->fontComboBox->hide();
    ui->horizontalSpacer->changeSize(0, 0);
}

// -------------------------------------------------------

void PanelPrimitiveValue::addDefault() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::DEFAULT),
        static_cast<int>(PrimitiveValueKind::Default));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addAnything() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::ANYTHING),
        static_cast<int>(PrimitiveValueKind::Anything));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNone() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::NONE), static_cast<
        int>(PrimitiveValueKind::None));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNumber() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::NUMBER),
        static_cast<int>(PrimitiveValueKind::Number));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNumberDouble() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::NUMBER),
        static_cast<int>(PrimitiveValueKind::NumberDouble));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addVariable() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::VARIABLE),
        static_cast<int>(PrimitiveValueKind::Variable));
    ui->widgetVariable->initialize(1);
    connect(ui->widgetVariable->list(), SIGNAL(itemChanged(QListWidgetItem *)),
        this, SLOT(on_variableChanged(QListWidgetItem *)));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addParameter(QStandardItemModel *model) {
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 0) {
        ui->comboBoxChoice->addItem(RPM::translate(Translations::PARAMETER),
            static_cast<int>(PrimitiveValueKind::Parameter));
        m_model->setModelParameter(model);
        SuperListItem::fillComboBox(ui->comboBoxParameter, model);
        connect(ui->comboBoxParameter, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxParameterCurrentIndexChanged(int)));
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addProperty(QStandardItemModel *model) {
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 1) {
        ui->comboBoxChoice->addItem(RPM::translate(Translations::PROPERTY),
            static_cast<int>(PrimitiveValueKind::Property));
        m_model->setModelProperties(model);
        SuperListItem::fillComboBox(ui->comboBoxProperty, model);
        connect(ui->comboBoxProperty, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxPropertyCurrentIndexChanged(int)));
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addDataBase(QStandardItemModel *model,
    PrimitiveValueKind kind)
{
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 0)
    {
        ui->comboBoxChoice->addItem(RPM::ENUM_TO_PRIMITIVE_KIND.at(
            static_cast<int>(kind)), static_cast<int>(kind));
        if (kind == PrimitiveValueKind::DataBase)
        {
            m_model->setModelDataBase(model);
            SuperListItem::fillComboBox(ui->comboBoxDataBase, model);
            connect(ui->comboBoxDataBase, SIGNAL(currentIndexChanged(int)), this,
               SLOT(on_comboBoxDataBaseCurrentIndexChanged(int)));
            ui->comboBoxChoice->setCurrentIndex(0);
        }
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addMessage(bool formula) {
    ui->comboBoxChoice->addItem(formula ? RPM::translate(Translations::FORMULA)
        : RPM::translate(Translations::TEXT), static_cast<int>(
        PrimitiveValueKind::Message));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addScript() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::SCRIPT),
        static_cast<int>(PrimitiveValueKind::Script));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addSwitch() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::SWITCH),
        static_cast<int>(PrimitiveValueKind::Switch));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addKeyBoard() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::KEYBOARD),
        static_cast<int>(PrimitiveValueKind::KeyBoard));
    SuperListItem::fillComboBox(ui->comboBoxKeyBoard, RPM::get()->project()
        ->keyBoardDatas()->model());
    connect(ui->comboBoxKeyBoard, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxKeyBoardCurrentIndexChanged(int)));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addFont() {
    ui->comboBoxChoice->addItem(RPM::translate(Translations::FONT), static_cast<
        int>(PrimitiveValueKind::Font));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addCustomStructure(bool isList)
{
    if (isList)
    {
        ui->comboBoxChoice->addItem(RPM::translate(Translations::CUSTOM_LIST),
            static_cast<int>(PrimitiveValueKind::CustomList));
    } else
    {
        ui->comboBoxChoice->addItem(RPM::translate(Translations
            ::CUSTOM_STRUCTURE), static_cast<int>(PrimitiveValueKind
            ::CustomStructure));
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::showDefault() {
    setKind(PrimitiveValueKind::Default);
    hideAll();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showAnything() {
    setKind(PrimitiveValueKind::Anything);
    hideAll();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showNone() {
    setKind(PrimitiveValueKind::None);
    hideAll();
    ui->horizontalSpacer->changeSize(10, 0);
}

// -------------------------------------------------------

void PanelPrimitiveValue::showNumber() {
    setKind(PrimitiveValueKind::Number);
    hideAll();
    ui->spinBoxNumber->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showNumberDouble() {
    setKind(PrimitiveValueKind::NumberDouble);
    hideAll();
    ui->doubleSpinBoxNumber->show();
}


// -------------------------------------------------------

void PanelPrimitiveValue::showVariable() {
    setKind(PrimitiveValueKind::Variable);
    hideAll();
    ui->widgetVariable->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showParameter() {
    setKind(PrimitiveValueKind::Parameter);
    hideAll();
    ui->comboBoxParameter->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showProperty() {
    setKind(PrimitiveValueKind::Property);
    hideAll();
    ui->comboBoxProperty->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showDataBase()
{
    setKind(PrimitiveValueKind::DataBase);
    hideAll();
    ui->comboBoxDataBase->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showDataBaseCustom()
{
    PrimitiveValueKind kind = static_cast<PrimitiveValueKind>(ui->comboBoxChoice
        ->currentData().toInt());
    QStandardItemModel *model;
    switch (kind)
    {
    case PrimitiveValueKind::Class:
        model = RPM::get()->project()->gameDatas()->classesDatas()->model();
        break;
    case PrimitiveValueKind::Hero:
        model = RPM::get()->project()->gameDatas()->heroesDatas()->model();
        break;
    case PrimitiveValueKind::Monster:
        model = RPM::get()->project()->gameDatas()->monstersDatas()->model();
        break;
    case PrimitiveValueKind::Troop:
        model = RPM::get()->project()->gameDatas()->troopsDatas()->model();
        break;
    case PrimitiveValueKind::Item:
        model = RPM::get()->project()->gameDatas()->itemsDatas()->model();
        break;
    case PrimitiveValueKind::Weapon:
        model = RPM::get()->project()->gameDatas()->weaponsDatas()->model();
        break;
    case PrimitiveValueKind::Armor:
        model = RPM::get()->project()->gameDatas()->armorsDatas()->model();
        break;
    case PrimitiveValueKind::Skill:
        model = RPM::get()->project()->gameDatas()->skillsDatas()->model();
        break;
    case PrimitiveValueKind::Animation:
        model = RPM::get()->project()->gameDatas()->animationsDatas()->model();
        break;
    //case PrimitiveValueKind::Animation:
    /*
        model = RPM::get()->project()->gameDatas()->statusDatas()->model(),*/
    case PrimitiveValueKind::Tileset:
        model = RPM::get()->project()->gameDatas()->tilesetsDatas()->model();
        break;
    case PrimitiveValueKind::FontSize:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelFontSizes();
        break;
    case PrimitiveValueKind::FontName:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelFontNames();
        break;
    case PrimitiveValueKind::Color:
        model = RPM::get()->project()->gameDatas()->systemDatas()->modelColors();
        break;
    case PrimitiveValueKind::WindowSkin:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelWindowSkins();
        break;
    case PrimitiveValueKind::Currency:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelCurrencies();
        break;
    case PrimitiveValueKind::Speed:
        model = RPM::get()->project()->gameDatas()->systemDatas()->modelSpeed();
        break;
    case PrimitiveValueKind::Detection:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelDetections();
        break;
    case PrimitiveValueKind::CameraProperty:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelcameraProperties();
        break;
    case PrimitiveValueKind::Frequency:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelFrequencies();
        break;
    case PrimitiveValueKind::Skybox:
        model = RPM::get()->project()->gameDatas()->systemDatas()
            ->modelSkyBoxes();
        break;
    case PrimitiveValueKind::BattleMap:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelBattleMaps();
        break;
    case PrimitiveValueKind::Element:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelElements();
        break;
    case PrimitiveValueKind::CommonStatistic:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelCommonStatistics();
        break;
    case PrimitiveValueKind::WeaponsKind:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelWeaponsKind();
        break;
    case PrimitiveValueKind::ArmorsKind:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelArmorsKind();
        break;
    case PrimitiveValueKind::CommonBattleCommand:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelCommonBattleCommand();
        break;
    case PrimitiveValueKind::CommonEquipment:
        model = RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelCommonEquipment();
        break;
    case PrimitiveValueKind::Event:
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsUser();
        break;
    case PrimitiveValueKind::State:
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelStates();
        break;
    case PrimitiveValueKind::CommonReaction:
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelCommonReactors();
        break;
    case PrimitiveValueKind::Model:
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelCommonObjects();
        break;
    default:
        model = nullptr;
        break;
    }
    m_model->setModelDataBase(model);
    setKind(kind);
    hideAll();
    disconnect(ui->comboBoxDataBase, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxDataBaseCurrentIndexChanged(int)));
    ui->comboBoxDataBase->clear();
    SuperListItem::fillComboBox(ui->comboBoxDataBase, model);
    connect(ui->comboBoxDataBase, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxDataBaseCurrentIndexChanged(int)));
    ui->comboBoxDataBase->setCurrentIndex(0);
    ui->comboBoxDataBase->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::clearDataBase() {
    ui->comboBoxDataBase->clear();
    ui->comboBoxChoice->removeItem(ui->comboBoxChoice->findData(static_cast<
        QVariant>(static_cast<int>(PrimitiveValueKind::DataBase))));
    addDataBase(m_model->modelDataBase());
    if (m_model->modelDataBase() != nullptr && m_model->modelDataBase()
        ->invisibleRootItem()->rowCount() > 0)
    {
        this->showDataBase();
    } else
    {
        this->showNumber();
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::showMessage() {
    setKind(PrimitiveValueKind::Message);
    hideAll();
    ui->lineEditMessage->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showScript() {
    setKind(PrimitiveValueKind::Script);
    hideAll();
    ui->lineEditScript->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showSwitch() {
    setKind(PrimitiveValueKind::Switch);
    hideAll();
    ui->comboBoxSwitch->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showKeyBoard() {
    setKind(PrimitiveValueKind::KeyBoard);
    hideAll();
    ui->comboBoxKeyBoard->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showFront() {
    setKind(PrimitiveValueKind::Font);
    hideAll();
    ui->fontComboBox->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::showCustomStructure(bool isList)
{
    if (isList)
    {
        setKind(PrimitiveValueKind::CustomList);
        hideAll();
        //ui->widgetCustomList->show();
    } else
    {
        setKind(PrimitiveValueKind::CustomStructure);
        hideAll();
        //ui->widgetCustomStructure->show();
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::clear()
{
    ui->comboBoxChoice->clear();
    ui->comboBoxDataBase->clear();
    ui->comboBoxProperty->clear();
    ui->comboBoxParameter->clear();
}

// -------------------------------------------------------

int PanelPrimitiveValue::getKindIndex(PrimitiveValueKind kind) {
    for (int i = 0; i < ui->comboBoxChoice->count(); i++) {
        if (ui->comboBoxChoice->itemData(i).toInt() == static_cast<int>(kind))
            return i;
    }

    return -1;
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeCommand(EventCommand *command, int &i) {
    switch (m_kind) {
    case PanelPrimitiveValueKind::Primitives:
    case PanelPrimitiveValueKind::ParameterEvent:
        break;
    case PanelPrimitiveValueKind::ConstantVariable:
    case PanelPrimitiveValueKind::DataBaseCommandId:
    case PanelPrimitiveValueKind::Number:
    case PanelPrimitiveValueKind::VariableParamProp:
        setKind(static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
            .toInt()));
        if (m_model->kind() == PrimitiveValueKind::NumberDouble)
            setNumberDoubleValue(command->valueCommandAt(i++).toDouble());
        else
            setNumberValue(command->valueCommandAt(i++).toInt());
        break;
    case PanelPrimitiveValueKind::Message:
    case PanelPrimitiveValueKind::Font:
        setKind(static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
            .toInt()));
        if (m_model->kind() == PrimitiveValueKind::Message || m_model->kind() ==
            PrimitiveValueKind::Font)
        {
            setMessageValue(command->valueCommandAt(i++));
        } else {
            setNumberValue(command->valueCommandAt(i++).toInt());
        }
        break;
    case PanelPrimitiveValueKind::Switch:
    case PanelPrimitiveValueKind::Property:
        setKind(static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
            .toInt()));
        switch (m_model->kind()) {
        case PrimitiveValueKind::Number:
        case PrimitiveValueKind::Variable:
        case PrimitiveValueKind::Parameter:
        case PrimitiveValueKind::Property:
        case PrimitiveValueKind::KeyBoard:
            setNumberValue(command->valueCommandAt(i++).toInt());
            break;
        case PrimitiveValueKind::NumberDouble:
            setNumberDoubleValue(command->valueCommandAt(i++).toDouble());
            break;
        case PrimitiveValueKind::Switch:
            setSwitchValue(command->valueCommandAt(i++) == RPM::TRUE_BOOL_STRING);
            break;
        default:
            setMessageValue(command->valueCommandAt(i++));
            break;
        }
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::getCommand(QVector<QString> &command) {
    switch (m_kind) {
    case PanelPrimitiveValueKind::Primitives:
    case PanelPrimitiveValueKind::ParameterEvent:
        break;
    case PanelPrimitiveValueKind::ConstantVariable:
    case PanelPrimitiveValueKind::DataBaseCommandId:
    case PanelPrimitiveValueKind::Number:
    case PanelPrimitiveValueKind::VariableParamProp:
        command.append(QString::number(static_cast<int>(m_model->kind())));

        if (m_model->kind() == PrimitiveValueKind::NumberDouble)
            command.append(QString::number(m_model->numberDoubleValue()));
        else
            command.append(QString::number(m_model->numberValue()));

        break;
    case PanelPrimitiveValueKind::Message:
    case PanelPrimitiveValueKind::Font:
        command.append(QString::number(static_cast<int>(m_model->kind())));

        if (m_model->kind() == PrimitiveValueKind::Message || m_model->kind() ==
            PrimitiveValueKind::Font)
        {
            command.append(m_model->messageValue());
        } else {
            command.append(QString::number(m_model->numberValue()));
        }
        break;
    case PanelPrimitiveValueKind::Switch:
    case PanelPrimitiveValueKind::Property:
        command.append(QString::number(static_cast<int>(m_model->kind())));

        switch (m_model->kind()) {
        case PrimitiveValueKind::Number:
        case PrimitiveValueKind::Variable:
        case PrimitiveValueKind::Parameter:
        case PrimitiveValueKind::Property:
        case PrimitiveValueKind::KeyBoard:
            command.append(QString::number(m_model->numberValue()));
            break;
        case PrimitiveValueKind::NumberDouble:
            command.append(QString::number(m_model->numberDoubleValue()));
            break;
        case PrimitiveValueKind::Switch:
            command.append(m_model->switchValue() ? RPM::TRUE_BOOL_STRING : RPM
                ::FALSE_BOOL_STRING);
            break;
        default:
            command.append(m_model->messageValue());
            break;
        }
        break;
    default:
        break;
    }
}

//-------------------------------------------------

void PanelPrimitiveValue::translate()
{

}

// -------------------------------------------------------

bool PanelPrimitiveValue::eventFilter(QObject *o, QEvent *e) {

    if (e->type() == QEvent::Wheel && !reinterpret_cast<QWidget *>(o)->hasFocus())
    {
        e->ignore();
        return true;
    }
    return QWidget::eventFilter(o, e);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxChoiceCurrentIndexChanged(int index) {
    PrimitiveValueKind kind = static_cast<PrimitiveValueKind>(ui->comboBoxChoice
        ->itemData(index).toInt());
    switch(kind)
    {
    case PrimitiveValueKind::Default:
        showDefault(); break;
    case PrimitiveValueKind::Anything:
        showAnything(); break;
    case PrimitiveValueKind::None:
        showNone(); break;
    case PrimitiveValueKind::Number:
        showNumber(); break;
    case PrimitiveValueKind::Variable:
        showVariable(); break;
    case PrimitiveValueKind::Parameter:
        showParameter(); break;
    case PrimitiveValueKind::Property:
        showProperty(); break;
    case PrimitiveValueKind::DataBase:
        showDataBase(); break;
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
        showDataBaseCustom(); break;
    case PrimitiveValueKind::Message:
        showMessage(); break;
    case PrimitiveValueKind::Script:
        showScript(); break;
    case PrimitiveValueKind::Switch:
        showSwitch(); break;
    case PrimitiveValueKind::KeyBoard:
        showKeyBoard(); break;
    case PrimitiveValueKind::NumberDouble:
        showNumberDouble(); break;
    case PrimitiveValueKind::Font:
        showFront(); break;
    case PrimitiveValueKind::CustomStructure:
        showCustomStructure(false); break;
    case PrimitiveValueKind::CustomList:
        showCustomStructure(true); break;
    }

    emit kindUpdated(kind);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_spinBoxNumber_valueChanged(int i) {
    setNumberValue(i);

    emit numberUpdated(i);
}

void PanelPrimitiveValue::on_doubleSpinBoxNumber_valueChanged(double i) {
    setNumberDoubleValue(i);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_variableChanged(QListWidgetItem *) {
    setNumberValue(ui->widgetVariable->currentId());

    emit numberUpdated(-1);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxParameterCurrentIndexChanged(int index) {
    setNumberValue(SuperListItem::getIdByIndex(m_model->modelParameter(), index));
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxPropertyCurrentIndexChanged(int index) {
    setNumberValue(SuperListItem::getIdByIndex(m_model->modelProperties(), index));
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxDataBaseCurrentIndexChanged(int index){
    int id = SuperListItem::getIdByIndex(m_model->modelDataBase(), index);

    setNumberValue(id);

    emit numberUpdated(id);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxKeyBoardCurrentIndexChanged(int index) {
    setNumberValue(SuperListItem::getIdByIndex(RPM::get()->project()
        ->keyBoardDatas()->model(), index));
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_lineEditMessage_textChanged(const QString &text) {
    int p = ui->lineEditMessage->cursorPosition();
    setMessageValue(text);
    ui->lineEditMessage->setCursorPosition(p);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_lineEditScript_textChanged(const QString &text) {
    int p = ui->lineEditScript->cursorPosition();
    setMessageValue(text);
    ui->lineEditMessage->setCursorPosition(p);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxSwitch_currentIndexChanged(int index) {
    setSwitchValue(index == 0);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_fontComboBox_currentIndexChanged(int) {
    this->setMessageValue(ui->fontComboBox->currentText());
}
