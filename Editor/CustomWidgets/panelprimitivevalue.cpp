/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

    Q_FOREACH(QSpinBox * sp, findChildren<QSpinBox*>()) {
        sp->installEventFilter(this);
    }
    Q_FOREACH(QDoubleSpinBox * sp, findChildren<QDoubleSpinBox*>()) {
        sp->installEventFilter(this);
    }
    Q_FOREACH(QComboBox * sp, findChildren<QComboBox*>()) {
        sp->installEventFilter(this);
    }
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
    addMessage();
    addSwitch();
    addKeyBoard();
    setNumberValue(m_model->numberValue());
    setMessageValue(m_model->messageValue());
    setSwitchValue(m_model->switchValue());
    initialize();
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeParameterEvent(QStandardItemModel
    *properties)
{
    m_kind = PanelPrimitiveValueKind::ParameterEvent;
    addDefault();
    addAnything();
    addNone();
    addNumber();
    addMessage();
    addSwitch();
    addKeyBoard();
    addProperty(properties);
    setNumberValue(m_model->numberValue());
    setMessageValue(m_model->messageValue());
    setSwitchValue(m_model->switchValue());
    initialize();
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

void PanelPrimitiveValue::initializeMessage(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::Message;
    addParameter(parameters);
    addProperty(properties);
    addMessage();
    addVariable();
    initialize();
    showMessage();
    setMessageValue(m_model->messageValue());
}

// -------------------------------------------------------

void PanelPrimitiveValue::initializeProperty(QStandardItemModel *parameters,
    QStandardItemModel *properties)
{
    m_kind = PanelPrimitiveValueKind::Property;
    addNone();
    addNumberDouble();
    addVariable();
    addMessage();
    addSwitch();
    addKeyBoard();
    addParameter(parameters);
    addProperty(properties);
    setNumberDoubleValue(m_model->numberDoubleValue());
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

void PanelPrimitiveValue::initializeMessageAndUpdate(PrimitiveValue *m)
{
    initializeMessage();
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
    ui->horizontalSpacer->changeSize(0, 0);
}

// -------------------------------------------------------

void PanelPrimitiveValue::addDefault() {
    ui->comboBoxChoice->addItem("Default", static_cast<int>(
        PrimitiveValueKind::Default));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addAnything() {
    ui->comboBoxChoice->addItem("Anything", static_cast<int>(
        PrimitiveValueKind::Anything));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNone() {
    ui->comboBoxChoice->addItem("None", static_cast<int>(
        PrimitiveValueKind::None));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNumber() {
    ui->comboBoxChoice->addItem("Number", static_cast<int>(
        PrimitiveValueKind::Number));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addNumberDouble() {
    ui->comboBoxChoice->addItem("Number", static_cast<int>(
        PrimitiveValueKind::NumberDouble));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addVariable() {
    ui->comboBoxChoice->addItem("Variable", static_cast<int>(
        PrimitiveValueKind::Variable));
    ui->widgetVariable->initialize(1);
    connect(ui->widgetVariable->list(), SIGNAL(itemChanged(QListWidgetItem *)),
        this, SLOT(on_variableChanged(QListWidgetItem *)));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addParameter(QStandardItemModel *model) {
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 0) {
        ui->comboBoxChoice->addItem("Parameter", static_cast<int>(
            PrimitiveValueKind::Parameter));
        m_model->setModelParameter(model);
        SuperListItem::fillComboBox(ui->comboBoxParameter, model);
        connect(ui->comboBoxParameter, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxParameterCurrentIndexChanged(int)));
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addProperty(QStandardItemModel *model) {
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 1) {
        ui->comboBoxChoice->addItem("Property", static_cast<int>(
            PrimitiveValueKind::Property));
        m_model->setModelProperties(model);
        SuperListItem::fillComboBox(ui->comboBoxProperty, model);
        connect(ui->comboBoxProperty, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxPropertyCurrentIndexChanged(int)));
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addDataBase(QStandardItemModel *model) {
    if (model != nullptr && model->invisibleRootItem()->rowCount() > 0) {
        ui->comboBoxChoice->insertItem(0, "Selection", static_cast<int>(
            PrimitiveValueKind::DataBase));
        m_model->setModelDataBase(model);
        SuperListItem::fillComboBox(ui->comboBoxDataBase, model);
        connect(ui->comboBoxDataBase, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxDataBaseCurrentIndexChanged(int)));
        ui->comboBoxChoice->setCurrentIndex(0);
    }
}

// -------------------------------------------------------

void PanelPrimitiveValue::addMessage() {
    ui->comboBoxChoice->addItem("Formula", static_cast<int>(
        PrimitiveValueKind::Message));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addScript() {
    ui->comboBoxChoice->addItem("Script", static_cast<int>(
        PrimitiveValueKind::Script));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addSwitch() {
    ui->comboBoxChoice->addItem("Switch", static_cast<int>(
        PrimitiveValueKind::Switch));
}

// -------------------------------------------------------

void PanelPrimitiveValue::addKeyBoard() {
    ui->comboBoxChoice->addItem("Keyboard", static_cast<int>(
        PrimitiveValueKind::KeyBoard));
    SuperListItem::fillComboBox(ui->comboBoxKeyBoard, RPM::get()->project()
        ->keyBoardDatas()->model());
    connect(ui->comboBoxKeyBoard, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxKeyBoardCurrentIndexChanged(int)));
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

void PanelPrimitiveValue::showDataBase() {
    setKind(PrimitiveValueKind::DataBase);
    hideAll();
    ui->comboBoxDataBase->show();
}

// -------------------------------------------------------

void PanelPrimitiveValue::clearDataBase() {
    ui->comboBoxDataBase->clear();
    ui->comboBoxChoice->removeItem(ui->comboBoxChoice->findData(static_cast<
        QVariant>(static_cast<int>(PrimitiveValueKind::DataBase))));
    addDataBase(m_model->modelDataBase());
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
        setKind(static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
            .toInt()));
        if (m_model->kind() == PrimitiveValueKind::Message) {
            setMessageValue(command->valueCommandAt(i++));
        } else {
            setNumberValue(command->valueCommandAt(i++).toInt());
        }
        break;
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
        command.append(QString::number(static_cast<int>(m_model->kind())));

        if (m_model->kind() == PrimitiveValueKind::Message)
            command.append(m_model->messageValue());
        else
            command.append(QString::number(m_model->numberValue()));
        break;
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
    }
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

    switch(kind) {
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
    }
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
    setMessageValue(text);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_lineEditScript_textChanged(const QString &text) {
    setMessageValue(text);
}

// -------------------------------------------------------

void PanelPrimitiveValue::on_comboBoxSwitch_currentIndexChanged(int index) {
    setSwitchValue(index == 0);
}
